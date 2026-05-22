import { eq, desc, asc, and, sql } from 'drizzle-orm';
import { db } from '../index';
import { userGroup, groupMember, userProfile } from '../schema';

export interface LeaderboardRankItem {
    userId: string;
    fullName: string | null;
    avatarUrl: string | null;
    totalScore: number;
}

export interface GroupLeaderboardPreview {
    groupId: string;
    groupName: string;
    description: string | null;
    topMembers: LeaderboardRankItem[];
}

/**
 * Retrieves all groups a user is part of, along with the top 3 members and their aggregated scores.
 */
export async function getUserGroupsLeaderboardPreviews(
    userId: string, 
    timeframe: 'weekly' | 'all-time' = 'all-time'
): Promise<GroupLeaderboardPreview[]> {
    // 1. Get all groups the user is a member of
    const userGroups = await db
        .select({
            id: userGroup.id,
            name: userGroup.name,
            description: userGroup.description,
        })
        .from(groupMember)
        .innerJoin(userGroup, eq(groupMember.groupId, userGroup.id))
        .where(eq(groupMember.userId, userId));

    const previews: GroupLeaderboardPreview[] = [];

    // 2. For each group, get the top 3 members
    for (const group of userGroups) {
        const topMembers = await getGroupLeaderboard(group.id, timeframe, 3);
        previews.push({
            groupId: group.id,
            groupName: group.name,
            description: group.description,
            topMembers,
        });
    }

    return previews;
}

/**
 * Retrieves the complete leaderboard for a specific group, ordered by weekly or all-time score descending,
 * with chronological tie-breaking (earliest completion time wins a tie).
 */
export async function getGroupLeaderboard(
    groupId: string, 
    timeframe: 'weekly' | 'all-time' = 'all-time',
    limit?: number
): Promise<LeaderboardRankItem[]> {
    const scoreExpression = timeframe === 'weekly' 
        ? groupMember.weeklyScore 
        : sql<number>`${groupMember.allTimeScore} + ${groupMember.weeklyScore}`;

    const query = db
        .select({
            userId: userProfile.id,
            fullName: userProfile.fullName,
            avatarUrl: userProfile.avatarUrl,
            totalScore: scoreExpression,
        })
        .from(groupMember)
        .innerJoin(userProfile, eq(groupMember.userId, userProfile.id))
        .where(eq(groupMember.groupId, groupId))
        .orderBy(
            desc(scoreExpression),
            asc(groupMember.weeklyLastUpdated)
        );

    if (limit) {
        query.limit(limit);
    }

    const results = await query;

    return results.map(row => ({
        ...row,
        totalScore: Number(row.totalScore)
    }));
}
