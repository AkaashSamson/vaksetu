import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { text, targetLanguage, action } = body;

        if (!process.env.SARVAM_API_KEY) {
            return NextResponse.json(
                { error: "Missing SARVAM_API_KEY in environment variables." },
                { status: 500 }
            );
        }

        if (!text || text.trim() === '') {
            return NextResponse.json(
                { error: "Text to process is required." },
                { status: 400 }
            );
        }

        if (!targetLanguage) {
            return NextResponse.json(
                { error: "Target language code is required." },
                { status: 400 }
            );
        }

        // Action 1: Translate English text into target Indian language
        if (action === 'translate') {
            const payload = {
                input: text.trim(),
                source_language_code: 'en-IN',
                target_language_code: targetLanguage,
                model: 'sarvam-translate:v1'
            };

            const response = await fetch('https://api.sarvam.ai/translate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'api-subscription-key': process.env.SARVAM_API_KEY
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok) {
                console.error("Translate API error:", data);
                return NextResponse.json(
                    { error: data.message || "Failed to translate." },
                    { status: response.status }
                );
            }

            return NextResponse.json({ translatedText: data.translated_text });
        }

        // Action 2: Convert target Indian language text into text-to-speech audio
        if (action === 'tts') {
            const payload = {
                inputs: [text.trim()],
                target_language_code: targetLanguage,
                speaker: 'shreya', // Polyglot voice supporting all 11 Indian languages
                model: 'bulbul:v3'
            };

            const response = await fetch('https://api.sarvam.ai/text-to-speech', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'api-subscription-key': process.env.SARVAM_API_KEY
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok) {
                console.error("TTS API error:", data);
                return NextResponse.json(
                    { error: data.message || (data.error && data.error.message) || JSON.stringify(data) || "Failed to synthesize speech." },
                    { status: response.status }
                );
            }

            if (!data.audios || !data.audios[0]) {
                return NextResponse.json(
                    { error: "No audio generated." },
                    { status: 500 }
                );
            }

            return NextResponse.json({ audioBase64: data.audios[0] });
        }

        return NextResponse.json(
            { error: "Invalid action. Must be 'translate' or 'tts'." },
            { status: 400 }
        );

    } catch (error: any) {
        console.error("Translation proxy route error:", error);
        return NextResponse.json(
            { error: error.message || "An internal error occurred." },
            { status: 500 }
        );
    }
}
