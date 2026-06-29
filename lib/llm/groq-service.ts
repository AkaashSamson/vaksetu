import Groq from "groq-sdk";
import { GLOSS_TRANSLATION_SYSTEM_PROMPT, buildGlossTranslationPrompt } from "./prompts";

export async function synthesizeGlossesToEnglish(words: string[]): Promise<string> {
    if (!words || words.length === 0) {
        return "";
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        console.warn("[GroqService] GROQ_API_KEY missing. Returning fallback joined glosses.");
        return words.join(" ");
    }

    try {
        const groq = new Groq({ apiKey });

        const userPrompt = buildGlossTranslationPrompt(words);

        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: GLOSS_TRANSLATION_SYSTEM_PROMPT },
                { role: "user", content: userPrompt }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.3,
            max_tokens: 150
        });

        const translatedSentence = completion.choices[0]?.message?.content?.trim();

        if (translatedSentence) {
            // Remove surround quotes if model accidentally added them
            return translatedSentence.replace(/^["']|["']$/g, "");
        }

        return words.join(" ");
    } catch (error) {
        console.error("[GroqService] Error calling Groq API:", error);
        // Fallback gracefully to space-separated words
        return words.join(" ");
    }
}
