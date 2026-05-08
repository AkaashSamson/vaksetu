import { eq, sql, and } from 'drizzle-orm';
import { db } from '../index';
import { userGroup, groupMember, quizGroup } from '../schema';

export interface PopulatedCommunityGroup {
    id: string;
    name: string;
    description: string | null;
    inviteCode: string;
    ownerId: string | null;
    memberIds: string[];
    quizIds: string[];
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
        })
        .from(groupMember)
        .innerJoin(userGroup, eq(groupMember.groupId, userGroup.id))
        .where(eq(groupMember.userId, userId));

    const populatedGroups: PopulatedCommunityGroup[] = [];

    // For each group, fetch members and linked quizzes
    // In a production app with high volume, this N+1 should be optimized via aggregation, 
    // but this suffices for the current scale.
    for (const group of userGroups) {
        const members = await db
            .select({ userId: groupMember.userId })
            .from(groupMember)
            .where(eq(groupMember.groupId, group.id));
            
        const quizzes = await db
            .select({ quizId: quizGroup.quizId })
            .from(quizGroup)
            .where(eq(quizGroup.groupId, group.id));

        populatedGroups.push({
            ...group,
            memberIds: members.map(m => m.userId),
            quizIds: quizzes.map(q => q.quizId),
        });
    }

    return populatedGroups;
}

/**
 * Creates a new community group and adds the creator as a member.
 */
export async function createCommunityGroup(
    name: string,
    description: string,
    inviteCode: string,
    ownerId: string,
    quizIds: string[]
): Promise<PopulatedCommunityGroup> {
    
    // 1. Insert the group
    const [newGroup] = await db.insert(userGroup).values({
        name,
        description,
        inviteCode,
        createdBy: ownerId,
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

    return {
        id: newGroup.id,
        name: newGroup.name,
        description: newGroup.description,
        inviteCode: newGroup.inviteCode,
        ownerId: newGroup.createdBy,
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
