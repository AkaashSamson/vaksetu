import { config } from 'dotenv';
config({ path: '.env.local' });
import { GET } from '../app/api/quiz/[id]/route';

async function run() {
    console.log("--- TESTING GET /api/quiz/[id] ENDPOINT ---");
    const id = "87cc7edd-7b07-4d76-8b8a-8d70294cbb11";
    
    // Simulate Request and params
    const req = new Request(`http://localhost/api/quiz/${id}`);
    const context = { params: Promise.resolve({ id }) };
    
    const response = await GET(req as any, context);
    console.log("Response status:", response.status);
    const data = await response.json();
    console.dir(data, { depth: null });
    
    process.exit(0);
}

run();
