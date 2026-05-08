import { PopulatedCommunityGroup } from '../db/queries/communities';
import { PopulatedQuiz } from '../db/queries/quizzes';
import { GroupLeaderboardPreview, LeaderboardRankItem } from '../db/queries/leaderboard';
import { quizCatalog as hardcodedQuizzes } from '../quizzes/catalog';
import { seedGroups as hardcodedGroups } from '../communities/service';

// Reusing the hardcoded catalogs from the previous frontend implementation
// but reshaping them slightly if needed to match the new API contracts.

export const mockQuizzes: PopulatedQuiz[] = hardcodedQuizzes.map(q => ({
    id: q.id,
    title: q.title,
    description: q.description,
    difficulty: q.difficulty,
    type: 'image_mcq', // default
    content: { questions: q.questions },
}));

export const mockCommunities: PopulatedCommunityGroup[] = hardcodedGroups.map(g => ({
    id: g.id,
    name: g.name,
    description: g.description,
    inviteCode: g.code,
    ownerId: g.ownerId,
    memberIds: g.members,
    quizIds: g.quizIds,
    // Preserve leaderboard for UI rendering. Map to the same shape expected by the page.
    // Seed groups have { userId, name, score } entries.
    // The type `PopulatedCommunityGroup` does not include leaderboard explicitly, but the page accesses it.
    // Adding it here satisfies runtime expectations.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    leaderboard: g.leaderboard.map(l => ({ userId: l.userId, name: l.name, score: l.score })),
}));

export const mockLeaderboardPreviews: GroupLeaderboardPreview[] = hardcodedGroups.map(g => ({
    groupId: g.id,
    groupName: g.name,
    description: g.description,
    topMembers: g.leaderboard.slice(0, 3).map(l => ({
        userId: l.userId,
        fullName: l.name,
        avatarUrl: null,
        totalScore: l.score,
    }))
}));

export const getMockGroupLeaderboard = (groupId: string): LeaderboardRankItem[] => {
    const group = hardcodedGroups.find(g => g.id === groupId);
    if (!group) return [];
    
    return group.leaderboard.map(l => ({
        userId: l.userId,
        fullName: l.name,
        avatarUrl: null,
        totalScore: l.score,
    })).sort((a, b) => b.totalScore - a.totalScore);
};
