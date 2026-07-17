import { eq, desc, asc, and, sql, inArray } from 'drizzle-orm';
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

    const groupIds = userGroups.map(g => g.id);
    if (groupIds.length === 0) return [];

    // 2. Fetch all members and their scores for these groups in a single query
    const scoreExpression = timeframe === 'weekly' 
        ? groupMember.weeklyScore 
        : sql<number>`${groupMember.allTimeScore} + ${groupMember.weeklyScore}`;

    const allMembers = await db
        .select({
            groupId: groupMember.groupId,
            userId: userProfile.id,
            fullName: userProfile.fullName,
            avatarUrl: userProfile.avatarUrl,
            totalScore: scoreExpression,
            weeklyLastUpdated: groupMember.weeklyLastUpdated
        })
        .from(groupMember)
        .innerJoin(userProfile, eq(groupMember.userId, userProfile.id))
        .where(inArray(groupMember.groupId, groupIds));

    // Group and sort by score & date in-memory
    const groupMembersMap: Record<string, typeof allMembers> = {};
    for (const m of allMembers) {
        if (!groupMembersMap[m.groupId]) groupMembersMap[m.groupId] = [];
        groupMembersMap[m.groupId].push(m);
    }

    const previews: GroupLeaderboardPreview[] = [];
    for (const group of userGroups) {
        const members = groupMembersMap[group.id] || [];
        
        // Sort in memory similar to the database ordering:
        // score descending, then weeklyLastUpdated ascending
        const sorted = [...members].sort((a, b) => {
            const scoreDiff = Number(b.totalScore) - Number(a.totalScore);
            if (scoreDiff !== 0) return scoreDiff;
            return new Date(a.weeklyLastUpdated).getTime() - new Date(b.weeklyLastUpdated).getTime();
        });

        // Take top 3
        const topMembers = sorted.slice(0, 3).map(m => ({
            userId: m.userId,
            fullName: m.fullName,
            avatarUrl: m.avatarUrl,
            totalScore: Number(m.totalScore)
        }));

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
