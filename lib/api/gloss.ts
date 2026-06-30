/**
 * Fetch glosses from input English text.
 * Routes either to the internal Next.js API route (/api/gloss) or the external Python FastAPI backend
 * based on the NEXT_PUBLIC_TEXT_TO_GLOSS_PROVIDER env variable.
 */
export async function fetchGlossesFromText(englishText: string): Promise<string[]> {
    // Basic defensive checks
    if (!englishText || typeof englishText !== 'string') return [];

    const provider = process.env.NEXT_PUBLIC_TEXT_TO_GLOSS_PROVIDER || 'groq';

    try {
        // If provider is set to 'python', send request directly to the external Python FastAPI server.
        // Otherwise, send to our internal Next.js route (/api/gloss) which resolves to Groq or local Ollama.
        const url = provider === 'python'
            ? (process.env.NEXT_PUBLIC_GLOSS_API_URL || 'http://127.0.0.1:8000/convert-text-to-gloss')
            : '/api/gloss';
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: englishText })
        });
        
        if (!response.ok) {
            throw new Error(`Gloss API HTTP error: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.glosses && Array.isArray(data.glosses)) {
            // Guarantee .mp4 local mapping case parity natively
            return data.glosses.map((word: string) => word.toUpperCase());
        }
        
        return [];
    } catch (err) {
        console.warn(`Gloss mapping failed with provider '${provider}', falling back to local manual heuristic parser:`, err);
        // Fallback robust logic safely defaults back to naive word splitting
        const washedText = englishText.replace(/[^\w\s]|_/g, "").trim().toUpperCase();
        return washedText.split(/\s+/).filter(w => w.length > 0);
    }
}
