import { config } from 'dotenv';
config({ path: '.env.local' });
import { db } from '../lib/db';
import { sql } from 'drizzle-orm';
import * as fs from 'fs';
import * as path from 'path';

async function seedHybrid() {
    console.log("Seeding hybrid quizzes directly via Drizzle Client...");
    console.log("Database URL:", process.env.DATABASE_URL);
    
    try {
        const sqlFilePath = path.join(__dirname, '../supabase/clear_and_seed_hybrid.sql');
        console.log("Reading SQL from:", sqlFilePath);
        const sqlString = fs.readFileSync(sqlFilePath, 'utf8');

        console.log("Executing SQL migration & seeds...");
        // Execute the entire SQL script
        await db.execute(sql.raw(sqlString));
        
        console.log("✅ Database migrated and hybrid quizzes seeded successfully!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding hybrid quizzes:", error);
        process.exit(1);
    }
}

seedHybrid();
