import { NextResponse } from "next/server";

const DEFAULT_HTTP_URL = process.env.NEXT_PUBLIC_SIGN_API_HTTP_URL || "http://127.0.0.1:8000";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        console.log("\n=======================================================");
        console.log("🔍 [Feature Validation Request Sent to Python Backend]");
        console.log("=======================================================");

        const response = await fetch(`${DEFAULT_HTTP_URL}/validate_features`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        const data = await response.json();

        console.log("-------------------------------------------------------");
        console.log("✅ [Feature Validation Response from Backend]:");
        console.log(JSON.stringify(data, null, 2));
        console.log("=======================================================\n");

        if (!response.ok) {
            return NextResponse.json(data, { status: response.status });
        }

        return NextResponse.json(data);
    } catch (error: any) {
        console.error("❌ [Feature Validation Proxy Error]:", error.message || error);
        return NextResponse.json(
            { error: error.message || "Failed to validate features with backend." },
            { status: 500 }
        );
    }
}
