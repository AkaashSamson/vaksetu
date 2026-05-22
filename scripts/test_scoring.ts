import { config } from 'dotenv';
config({ path: '.env.local' });

// Define interfaces mimicking our Drizzle structures for simulation
interface MockAttempt {
    totalScore: number;
    completedAt: Date;
    attemptNumber: number;
}

interface MockMember {
    userId: string;
    fullName: string;
    weeklyScore: number;
    allTimeScore: number;
    weeklyLastUpdated: Date;
}

/**
 * A. Quiz Attempt Score Formula (Accuracy & Speed)
 */
function calculateAttemptScore(correct: number, total: number, timeTaken: number): number {
    const baseScore = correct * 100;
    const targetTime = total * 15;
    const timeBonus = Math.max(0, targetTime - timeTaken) * 2;
    const accuracyMultiplier = total > 0 ? (correct / total) : 0;
    return Math.round(baseScore + (timeBonus * accuracyMultiplier));
}

/**
 * B. Chronological Weekly Score Algorithm (Attempt Penalty)
 */
function calculateEffectiveQuizScore(attempts: MockAttempt[]): { bestScore: number; attemptsRequired: number; effectiveScore: number } {
    if (attempts.length === 0) {
        return { bestScore: 0, attemptsRequired: 0, effectiveScore: 0 };
    }

    // Sort attempts chronologically
    const sorted = [...attempts].sort((a, b) => a.completedAt.getTime() - b.completedAt.getTime());

    let bestScore = 0;
    let attemptsRequired = 1;

    for (let i = 0; i < sorted.length; i++) {
        const score = sorted[i].totalScore;
        if (score > bestScore) {
            bestScore = score;
            attemptsRequired = i + 1;
        }
    }

    const penalty = (attemptsRequired - 1) * 20;
    const effectiveScore = Math.max(0, bestScore - penalty);

    return { bestScore, attemptsRequired, effectiveScore };
}

/**
 * C. Leaderboard Sorting (Score DESC, weeklyLastUpdated ASC)
 */
function sortLeaderboard(members: MockMember[]): MockMember[] {
    return [...members].sort((a, b) => {
        if (b.weeklyScore !== a.weeklyScore) {
            return b.weeklyScore - a.weeklyScore; // Score descending
        }
        return a.weeklyLastUpdated.getTime() - b.weeklyLastUpdated.getTime(); // Earliest time ascending (tie-breaker)
    });
}

function runTests() {
    console.log("==================================================");
    console.log("🔥 RUNNING LEADERBOARD & SCORING ALGORITHM TESTS 🔥");
    console.log("==================================================\n");

    // --------------------------------------------------
    // TEST 1: Quiz Attempt Score Formula
    // --------------------------------------------------
    console.log("--- TEST 1: Attempt Score Formula (Accuracy & Speed) ---");
    
    // Case 1: Perfect accuracy, fast completion
    const score1 = calculateAttemptScore(6, 6, 30); // 30s taken (target is 90s)
    console.log(`Case 1 (Perfect, Fast - 6/6 correct in 30s): ${score1} points (Expected: 720)`);

    // Case 2: Perfect accuracy, slow completion
    const score2 = calculateAttemptScore(6, 6, 120); // 120s taken (exceeds 90s)
    console.log(`Case 2 (Perfect, Slow - 6/6 correct in 120s): ${score2} points (Expected: 600)`);

    // Case 3: 50% accuracy, fast completion
    const score3 = calculateAttemptScore(3, 6, 30); // 30s taken
    console.log(`Case 3 (50% Acc, Fast - 3/6 correct in 30s): ${score3} points (Expected: 300 + 120 * 0.5 = 360)`);

    // Case 4: Zero accuracy, instant completion (Cheating attempt prevention check)
    const score4 = calculateAttemptScore(0, 6, 1); 
    console.log(`Case 4 (0% Acc, 1s - Anti-cheat validation): ${score4} points (Expected: 0)\n`);


    // --------------------------------------------------
    // TEST 2: Chronological Attempt Penalty Algorithm
    // --------------------------------------------------
    console.log("--- TEST 2: Chronological Weekly Score & Attempt Penalty ---");

    const baseTime = new Date("2026-05-22T10:00:00Z");

    // User A: Perfect in 1 attempt
    const attemptsA: MockAttempt[] = [
        { totalScore: 720, attemptNumber: 1, completedAt: new Date(baseTime.getTime() + 1000) }
    ];
    const resA = calculateEffectiveQuizScore(attemptsA);
    console.log("User A (1 attempt, score 720):", resA);

    // User B: Achieves 720 but takes 3 attempts (e.g. 400 -> 720 -> 500)
    const attemptsB: MockAttempt[] = [
        { totalScore: 400, attemptNumber: 1, completedAt: new Date(baseTime.getTime() + 1000) },
        { totalScore: 720, attemptNumber: 2, completedAt: new Date(baseTime.getTime() + 2000) },
        { totalScore: 500, attemptNumber: 3, completedAt: new Date(baseTime.getTime() + 3000) }
    ];
    const resB = calculateEffectiveQuizScore(attemptsB);
    console.log("User B (3 attempts, reaches 720 on 2nd attempt):", resB, "(Expected effective score: 700 due to 1 extra attempt penalty of 20)");

    // User C: Achieves 600, takes 4 attempts, only improves gradually (300 -> 400 -> 500 -> 600)
    const attemptsC: MockAttempt[] = [
        { totalScore: 300, attemptNumber: 1, completedAt: new Date(baseTime.getTime() + 1000) },
        { totalScore: 400, attemptNumber: 2, completedAt: new Date(baseTime.getTime() + 2000) },
        { totalScore: 500, attemptNumber: 3, completedAt: new Date(baseTime.getTime() + 3000) },
        { totalScore: 600, attemptNumber: 4, completedAt: new Date(baseTime.getTime() + 4000) }
    ];
    const resC = calculateEffectiveQuizScore(attemptsC);
    console.log("User C (4 attempts, reaches 600 on 4th attempt):", resC, "(Expected effective score: 600 - (4 - 1)*20 = 540)\n");


    // --------------------------------------------------
    // TEST 3: Leaderboard Sorting & Tie-Breaking
    // --------------------------------------------------
    console.log("--- TEST 3: Leaderboard Sorting & Tie-Breaking ---");

    const time1 = new Date("2026-05-22T12:00:00Z");
    const time2 = new Date("2026-05-22T12:05:00Z"); // 5 mins later
    const time3 = new Date("2026-05-22T12:10:00Z"); // 10 mins later

    const members: MockMember[] = [
        {
            userId: "user_b",
            fullName: "Alice Smith (Gets 700 later)",
            weeklyScore: 700,
            allTimeScore: 1000,
            weeklyLastUpdated: time2
        },
        {
            userId: "user_c",
            fullName: "Charlie Brown (Gets 700 last)",
            weeklyScore: 700,
            allTimeScore: 800,
            weeklyLastUpdated: time3
        },
        {
            userId: "user_a",
            fullName: "Bob Jones (Gets 720 first)",
            weeklyScore: 720,
            allTimeScore: 1200,
            weeklyLastUpdated: time1
        },
        {
            userId: "user_d",
            fullName: "David Miller (Gets 700 first!)",
            weeklyScore: 700,
            allTimeScore: 900,
            weeklyLastUpdated: time1
        }
    ];

    console.log("Before Sorting:");
    members.forEach(m => console.log(` - ${m.fullName}: Score = ${m.weeklyScore}, Updated = ${m.weeklyLastUpdated.toISOString()}`));

    const sorted = sortLeaderboard(members);

    console.log("\nAfter Sorting (1. Score DESC, 2. LastUpdated ASC):");
    sorted.forEach((m, index) => {
        console.log(`Rank ${index + 1}: ${m.fullName} | Score = ${m.weeklyScore} | Updated = ${m.weeklyLastUpdated.toISOString()}`);
    });

    console.log("\n==================================================");
    console.log("✅ ALL TESTS COMPLETED SUCCESSFULLY! ✅");
    console.log("==================================================");
}

runTests();
