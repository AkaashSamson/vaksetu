import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL!;
const isTransactionPooler = connectionString.includes(':6543') || connectionString.includes('pgbouncer=true');
const client = postgres(connectionString, isTransactionPooler ? { prepare: false } : undefined);
export const db = drizzle(client, { schema });
