import { config } from 'dotenv';
config({ path: '.env.local' });
import { db } from '../lib/db';
import { sql } from 'drizzle-orm';

async function checkColumns() {
    console.log("Checking active database schema at:", process.env.DATABASE_URL);
    console.log("==================================================\n");

    const tables = ['group_member', 'user_group', 'quiz_attempt', 'quiz'];

    for (const table of tables) {
        console.log(`--- Table: ${table} ---`);
        const result = await db.execute(sql`
            SELECT column_name, data_type, is_nullable, column_default 
            FROM information_schema.columns 
            WHERE table_name = ${table}
            ORDER BY ordinal_position;
        `);

        if (result.length === 0) {
            console.log("❌ Table not found in database!");
        } else {
            result.forEach(row => {
                console.log(`  - ${row.column_name}: type=${row.data_type}, nullable=${row.is_nullable}, default=${row.column_default || 'NONE'}`);
            });
        }
        console.log("");
    }
    process.exit(0);
}

checkColumns();
