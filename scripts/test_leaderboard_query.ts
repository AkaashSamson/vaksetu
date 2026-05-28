import { config } from 'dotenv';
config({ path: '.env.local' });
import { getUserGroupsLeaderboardPreviews } from '../lib/db/queries/leaderboard';

async function test() {
    const userId = "2fa311ae-cb5b-4859-a4de-9e9e7c3f121c"; // Mr. Sky
    
    console.log("Fetching weekly leaderboard previews...");
    const weeklyPreviews = await getUserGroupsLeaderboardPreviews(userId, 'weekly');
    console.dir(weeklyPreviews, { depth: null });
    
    console.log("\nFetching all-time leaderboard previews...");
    const allTimePreviews = await getUserGroupsLeaderboardPreviews(userId, 'all-time');
    console.dir(allTimePreviews, { depth: null });
    
    process.exit(0);
}

test().catch(err => {
    console.error(err);
    process.exit(1);
});
