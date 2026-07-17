import { eq, sql, and, inArray } from 'drizzle-orm';
import { db } from '../index';
import { userGroup, groupMember, quizGroup, userProfile, quiz } from '../schema';

export interface PopulatedCommunityGroup {
    id: string;
    name: string;
    description: string | null;
    inviteCode: string;
    ownerId: string | null;
    ownerName?: string | null;
    isPublic: boolean | null;
    memberIds: string[];
    quizIds: string[];
    quizzes?: { id: string; title: string; description: string | null; activeThisWeek: boolean | null }[];
}

/**
 * Retrieves all groups across the platform.
 */
export async function getAllCommunities(): Promise<PopulatedCommunityGroup[]> {
    const allGroups = await db
        .select({
            id: userGroup.id,
            name: userGroup.name,
            description: userGroup.description,
            inviteCode: userGroup.inviteCode,
            ownerId: userGroup.createdBy,
            ownerName: userProfile.fullName,
            isPublic: userGroup.isPublic,
        })
        .from(userGroup)
        .leftJoin(userProfile, eq(userGroup.createdBy, userProfile.id));

    const groupIds = allGroups.map(g => g.id);
    if (groupIds.length === 0) return [];

    const allMembers = await db
        .select({ groupId: groupMember.groupId, userId: groupMember.userId })
        .from(groupMember)
        .where(inArray(groupMember.groupId, groupIds));
        
    const allQuizzes = await db
        .select({ groupId: quizGroup.groupId, quizId: quizGroup.quizId })
        .from(quizGroup)
        .where(inArray(quizGroup.groupId, groupIds));

    const membersMap: Record<string, string[]> = {};
    const quizzesMap: Record<string, string[]> = {};

    for (const m of allMembers) {
        if (!membersMap[m.groupId]) membersMap[m.groupId] = [];
        membersMap[m.groupId].push(m.userId);
    }
    for (const q of allQuizzes) {
        if (!quizzesMap[q.groupId]) quizzesMap[q.groupId] = [];
        quizzesMap[q.groupId].push(q.quizId);
    }

    return allGroups.map(group => ({
        ...group,
        memberIds: membersMap[group.id] || [],
        quizIds: quizzesMap[group.id] || [],
    }));
}

/**
 * Retrieves all groups a user is a member of.
 */
export async function getUserCommunities(userId: string): Promise<PopulatedCommunityGroup[]> {
    // Get the base groups
    const userGroups = await db
        .select({
            id: userGroup.id,
            name: userGroup.name,
            description: userGroup.description,
            inviteCode: userGroup.inviteCode,
            ownerId: userGroup.createdBy,
            ownerName: userProfile.fullName,
            isPublic: userGroup.isPublic,
        })
        .from(groupMember)
        .innerJoin(userGroup, eq(groupMember.groupId, userGroup.id))
        .leftJoin(userProfile, eq(userGroup.createdBy, userProfile.id))
        .where(eq(groupMember.userId, userId));

    const groupIds = userGroups.map(g => g.id);
    if (groupIds.length === 0) return [];

    const allMembers = await db
        .select({ groupId: groupMember.groupId, userId: groupMember.userId })
        .from(groupMember)
        .where(inArray(groupMember.groupId, groupIds));
        
    const allQuizzes = await db
        .select({ groupId: quizGroup.groupId, quizId: quizGroup.quizId })
        .from(quizGroup)
        .where(inArray(quizGroup.groupId, groupIds));

    const membersMap: Record<string, string[]> = {};
    const quizzesMap: Record<string, string[]> = {};

    for (const m of allMembers) {
        if (!membersMap[m.groupId]) membersMap[m.groupId] = [];
        membersMap[m.groupId].push(m.userId);
    }
    for (const q of allQuizzes) {
        if (!quizzesMap[q.groupId]) quizzesMap[q.groupId] = [];
        quizzesMap[q.groupId].push(q.quizId);
    }

    return userGroups.map(group => ({
        ...group,
        memberIds: membersMap[group.id] || [],
        quizIds: quizzesMap[group.id] || [],
    }));
}

/**
 * Creates a new community group and adds the creator as a member.
 */
export async function createCommunityGroup(
    name: string,
    description: string,
    inviteCode: string,
    ownerId: string,
    quizIds: string[],
    isPublic: boolean = true
): Promise<PopulatedCommunityGroup> {
    
    // 1. Insert the group
    const [newGroup] = await db.insert(userGroup).values({
        name,
        description,
        inviteCode,
        createdBy: ownerId,
        isPublic,
    }).returning();

    // 2. Add owner as member
    await db.insert(groupMember).values({
        groupId: newGroup.id,
        userId: ownerId,
        role: 'admin',
    });

    // 3. Link initial quizzes
    if (quizIds.length > 0) {
        const quizLinks = quizIds.map(qId => ({
            quizId: qId,
            groupId: newGroup.id,
        }));
        await db.insert(quizGroup).values(quizLinks);
    }

    // 4. Fetch the owner's name
    const [owner] = await db.select({ fullName: userProfile.fullName })
        .from(userProfile)
        .where(eq(userProfile.id, ownerId))
        .limit(1);

    return {
        id: newGroup.id,
        name: newGroup.name,
        description: newGroup.description,
        inviteCode: newGroup.inviteCode,
        ownerId: newGroup.createdBy,
        ownerName: owner?.fullName || null,
        isPublic: newGroup.isPublic,
        memberIds: [ownerId],
        quizIds: quizIds,
    };
}

/**
 * Joins a group using an invite code.
 */
export async function joinCommunityWithCode(
    inviteCode: string,
    userId: string
): Promise<{ ok: boolean; groupId?: string; error?: string }> {
    
    // 1. Find group by code
    const [group] = await db
        .select({ id: userGroup.id })
        .from(userGroup)
        .where(eq(userGroup.inviteCode, inviteCode))
        .limit(1);

    if (!group) {
        return { ok: false, error: 'INVALID_CODE' };
    }

    // 2. Check if already member
    const [existing] = await db
        .select({ userId: groupMember.userId })
        .from(groupMember)
        .where(
            and(
                eq(groupMember.groupId, group.id),
                eq(groupMember.userId, userId)
            )
        )
        .limit(1);

    if (existing) {
        return { ok: true, groupId: group.id }; // Already joined
    }

    // 3. Insert membership
    await db.insert(groupMember).values({
        groupId: group.id,
        userId: userId,
        role: 'member',
    });

    return { ok: true, groupId: group.id };
}

/**
 * Retrieves a single community group by ID.
 */
export async function getCommunityById(groupId: string): Promise<PopulatedCommunityGroup | null> {
    const [group] = await db
        .select({
            id: userGroup.id,
            name: userGroup.name,
            description: userGroup.description,
            inviteCode: userGroup.inviteCode,
            ownerId: userGroup.createdBy,
            ownerName: userProfile.fullName,
            isPublic: userGroup.isPublic,
        })
        .from(userGroup)
        .leftJoin(userProfile, eq(userGroup.createdBy, userProfile.id))
        .where(eq(userGroup.id, groupId))
        .limit(1);

    if (!group) return null;

    const members = await db
        .select({ userId: groupMember.userId })
        .from(groupMember)
        .where(eq(groupMember.groupId, group.id));
        
    const quizzes = await db
        .select({ 
            id: quiz.id, 
            title: quiz.title, 
            description: quiz.description, 
            activeThisWeek: quizGroup.activeThisWeek 
        })
        .from(quizGroup)
        .innerJoin(quiz, eq(quizGroup.quizId, quiz.id))
        .where(eq(quizGroup.groupId, group.id));

    return {
        ...group,
        memberIds: members.map(m => m.userId),
        quizIds: quizzes.map(q => q.id),
        quizzes: quizzes,
    };
}

/**
 * Adds a quiz to a group.
 */
export async function addQuizToGroup(groupId: string, quizId: string): Promise<void> {
    const [existing] = await db
        .select({ quizId: quizGroup.quizId })
        .from(quizGroup)
        .where(
            and(
                eq(quizGroup.groupId, groupId),
                eq(quizGroup.quizId, quizId)
            )
        )
        .limit(1);

    if (existing) return;

    await db.insert(quizGroup).values({
        groupId,
        quizId,
        activeThisWeek: false
    });
}

/**
 * Updates the weekly status of a quiz in a group.
 */
export async function updateQuizWeeklyStatus(groupId: string, quizId: string, activeThisWeek: boolean): Promise<void> {
    await db
        .update(quizGroup)
        .set({ activeThisWeek })
        .where(
            and(
                eq(quizGroup.groupId, groupId),
                eq(quizGroup.quizId, quizId)
            )
        );
}

/**
 * Joins a group by group ID directly.
 */
export async function joinCommunityById(
    groupId: string,
    userId: string
): Promise<{ ok: boolean; error?: string }> {
    // 1. Check if already member
    const [existing] = await db
        .select({ userId: groupMember.userId })
        .from(groupMember)
        .where(
            and(
                eq(groupMember.groupId, groupId),
                eq(groupMember.userId, userId)
            )
        )
        .limit(1);

    if (existing) {
        return { ok: true }; // Already joined
    }

    // 2. Insert membership
    await db.insert(groupMember).values({
        groupId: groupId,
        userId: userId,
        role: 'member',
    });

    return { ok: true };
}

/**
 * Leaves a group by group ID.
 */
export async function leaveCommunityById(
    groupId: string,
    userId: string
): Promise<{ ok: boolean; error?: string }> {
    await db
        .delete(groupMember)
        .where(
            and(
                eq(groupMember.groupId, groupId),
                eq(groupMember.userId, userId)
            )
        );

    return { ok: true };
}
