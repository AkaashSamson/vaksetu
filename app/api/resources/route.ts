import { NextResponse } from "next/server";
import { getLearningResources } from "@/lib/api/resources";

export async function GET() {
    try {
        const resources = await getLearningResources();
        return NextResponse.json(resources);
    } catch (error) {
        console.error("Failed to fetch resources:", error);
        return NextResponse.json({ error: "Failed to fetch resources" }, { status: 500 });
    }
}
