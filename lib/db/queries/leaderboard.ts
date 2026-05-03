import { eq, sql, desc, and, inArray } from 'drizzle-orm';
import { db } from '../index';
import { userGroup, groupMember, userProfile, quizAttempt, quizGroup } from '../schema';

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
 * Retrieves the complete leaderboard for a specific group, ordered by total score descending.
 * Score is calculated as the sum of the MAX score achieved per quiz.
 */
export async function getGroupLeaderboard(
    groupId: string, 
    timeframe: 'weekly' | 'all-time' = 'all-time',
    limit?: number
): Promise<LeaderboardRankItem[]> {
    
    // Subquery: Get the quizzes linked to this group, filtered by timeframe
    const applicableQuizzes = db
        .select({ id: quizGroup.quizId })
        .from(quizGroup)
        .where(
            and(
                eq(quizGroup.groupId, groupId),
                timeframe === 'weekly' ? eq(quizGroup.activeThisWeek, true) : undefined
            )
        );

    // Subquery: Get the max score per user per quiz for those quizzes
    const userMaxScores = db
        .select({
            userId: quizAttempt.userId,
            quizId: quizAttempt.quizId,
            maxScore: sql<number>`MAX(CAST(${quizAttempt.totalScore} AS DECIMAL))`.as('maxScore')
        })
        .from(quizAttempt)
        .where(inArray(quizAttempt.quizId, applicableQuizzes))
        .groupBy(quizAttempt.userId, quizAttempt.quizId)
        .as('user_max_scores');

    const query = db
        .select({
            userId: userProfile.id,
            fullName: userProfile.fullName,
            avatarUrl: userProfile.avatarUrl,
            totalScore: sql<number>`COALESCE(SUM(${userMaxScores.maxScore}), 0)`.as('totalScore'),
        })
        .from(groupMember)
        .innerJoin(userProfile, eq(groupMember.userId, userProfile.id))
        .leftJoin(userMaxScores, eq(groupMember.userId, userMaxScores.userId))
        .where(eq(groupMember.groupId, groupId))
        .groupBy(userProfile.id, userProfile.fullName, userProfile.avatarUrl)
        .orderBy(desc(sql`COALESCE(SUM(${userMaxScores.maxScore}), 0)`));

    if (limit) {
        query.limit(limit);
    }

    const results = await query;

    return results.map(row => ({
        ...row,
        totalScore: Number(row.totalScore)
    }));
}
