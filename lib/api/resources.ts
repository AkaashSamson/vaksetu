import { db } from "@/lib/db";
import { learningResource } from "@/lib/db/schema";
import { mockResources } from "@/lib/mock/resources";

export async function getLearningResources() {
    try {
        const resources = await db.select().from(learningResource);
        
        if (!resources || resources.length === 0) {
            return mockResources;
        }
        
        return resources;
    } catch (error) {
        console.error("Error fetching learning resources from DB:", error);
        return mockResources;
    }
}
