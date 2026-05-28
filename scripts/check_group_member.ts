import { config } from 'dotenv';
config({ path: '.env.local' });
import { db } from '../lib/db';
import { groupMember, userProfile } from '../lib/db/schema';

async function check() {
    console.log("Checking group members in DB...");
    const members = await db.select().from(groupMember);
    console.log("Group Members:", members);
    
    const profiles = await db.select().from(userProfile);
    console.log("User Profiles:", profiles);
    
    process.exit(0);
}

check().catch(err => {
    console.error(err);
    process.exit(1);
});
