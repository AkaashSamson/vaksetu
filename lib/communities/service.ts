export type CommunityLeaderboardEntry = {
    userId: string;
    name: string;
    score: number;
};

export type CommunityGroup = {
    id: string;
    name: string;
    description: string;
    code: string;

    // Admin = creator (frontend-only)
    ownerId: string;

    members: string[];

    // Quizzes linked to this community (from quiz catalog)
    quizIds: string[];

    leaderboard: CommunityLeaderboardEntry[];
};

function sleep(ms: number) {
    return new Promise((r) => setTimeout(r, ms));
}

/**
 * Frontend-only seed.
 * Replace with real API later.
 */
export const seedGroups: CommunityGroup[] = [
    {
        id: "grp-1",
        name: "Vaksetu Learners",
        description: "Beginner-friendly community for daily practice and accountability.",
        code: "VAK123",
        ownerId: "me",
        members: ["me"],
        quizIds: ["quiz-greetings", "quiz-numbers"],
        leaderboard: [
            { userId: "me", name: "You", score: 120 },
            { userId: "u-2", name: "Ayesha", score: 210 },
            { userId: "u-3", name: "Rohan", score: 160 },
        ],
    },
    {
        id: "grp-2",
        name: "Numbers Club",
        description: "Practice numbers and finger spelling challenges every week.",
        code: "NUM777",
        ownerId: "u-9",
        members: [],
        quizIds: ["quiz-numbers"],
        leaderboard: [
            { userId: "u-9", name: "Sara", score: 95 },
            { userId: "u-10", name: "Hassan", score: 80 },
        ],
    },
    {
        id: "grp-3",
        name: "Daily Phrases",
        description: "Common phrases, greetings, and conversational practice.",
        code: "DAY555",
        ownerId: "u-2",
        members: ["u-2"],
        quizIds: ["quiz-greetings", "quiz-common-words"],
        leaderboard: [{ userId: "u-2", name: "Ayesha", score: 140 }],
    },
];

export type JoinWithCodeResult =
    | { ok: true; groupId: string }
    | { ok: false; error: "INVALID_CODE" };

export async function joinWithCode(params: {
    code: string;
    groups: CommunityGroup[];
}): Promise<JoinWithCodeResult> {
    await sleep(500);
    const codeNorm = params.code.trim().toUpperCase();
    const found = params.groups.find((g) => g.code.toUpperCase() === codeNorm);
    if (!found) return { ok: false, error: "INVALID_CODE" };
    return { ok: true, groupId: found.id };
}

export async function createGroup(params: {
    name: string;
    description: string;
    code: string;
    ownerId: string;
    quizIds: string[];
}): Promise<{ ok: true; group: CommunityGroup }> {
    await sleep(500);

    const group: CommunityGroup = {
        id: `grp-${Math.random().toString(16).slice(2)}`,
        name: params.name.trim(),
        description: params.description.trim(),
        code: params.code.trim().toUpperCase(),
        ownerId: params.ownerId,
        members: [params.ownerId], // creator joins immediately
        quizIds: params.quizIds,
        leaderboard: [{ userId: params.ownerId, name: "You", score: 0 }],
    };

    return { ok: true, group };
}

export async function joinGroup(params: {
    groupId: string;
    userId: string;
}): Promise<{ ok: true }> {
    await sleep(300);
    return { ok: true };
}

export async function leaveGroup(params: {
    groupId: string;
    userId: string;
}): Promise<{ ok: true }> {
    await sleep(300);
    return { ok: true };
}

export async function addQuizzesToGroup(params: {
    groupId: string;
    quizIds: string[];
}): Promise<{ ok: true }> {
    await sleep(300);
    return { ok: true };
}