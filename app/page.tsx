"use client";

import React, { useState, useEffect, useRef } from "react";
import { Separator } from "@/components/ui/separator";
import {
    Languages,
    Mic,
    Camera,
    Play,
    Square,
    Copy,
    Volume2,
    Check,
    Loader2,
    Sparkles
} from "lucide-react";
import { CameraPreview } from "@/components/translation/camera-preview";
import { AudioRecorderCard } from "@/components/translation/microphone-input";
import { GlossVideoPlayer } from "@/components/avatar/GlossVideoPlayer";
import { Button } from "@/components/ui/button";

type Mode = "sign-to-text" | "speech-to-sign";
type TranslationState = "IDLE" | "CONNECTING" | "TRANSLATING" | "ERROR";

const SARVAM_LANGUAGES = [
    { code: "hi-IN", name: "Hindi" },
    { code: "te-IN", name: "Telugu" },
    { code: "ta-IN", name: "Tamil" },
    { code: "kn-IN", name: "Kannada" },
    { code: "ml-IN", name: "Malayalam" },
    { code: "mr-IN", name: "Marathi" },
    { code: "gu-IN", name: "Gujarati" },
    { code: "bn-IN", name: "Bengali" },
    { code: "pa-IN", name: "Punjabi" },
    { code: "od-IN", name: "Odia" }
];

export default function Page() {
    const [mode, setMode] = useState<Mode>("sign-to-text");
    const [speechText, setSpeechText] = useState("");

    // --- Sign-to-Text WebSocket State ---
    const [isTranslatingActive, setIsTranslatingActive] = useState(false);
    const [translationState, setTranslationState] = useState<TranslationState>("IDLE");
    const [detectedGlosses, setDetectedGlosses] = useState<string[]>([]);
    const [recognizedEnglish, setRecognizedEnglish] = useState("");
    const [isGeneratingSentence, setIsGeneratingSentence] = useState(false);

    // --- Multilingual Translation & Speech State ---
    const [targetLanguage, setTargetLanguage] = useState("hi-IN");
    const [translatedText, setTranslatedText] = useState("");
    const [audioSrc, setAudioSrc] = useState<string | null>(null);
    const [isTranslatingText, setIsTranslatingText] = useState(false);
    const [isGeneratingSpeech, setIsGeneratingSpeech] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const audioRef = useRef<HTMLAudioElement | null>(null);

    const isSignToText = mode === "sign-to-text";

    const handleModeSwitch = (newMode: Mode) => {
        // Clear active socket if switching mode
        setIsTranslatingActive(false);
        setMode(newMode);
        setSpeechText("");
    };

    // Toggle live translation socket state
    const toggleTranslation = () => {
        if (isTranslatingActive) {
            setIsTranslatingActive(false);
            setIsGeneratingSentence(true);
        } else {
            // Reset state values for a fresh translation run
            setDetectedGlosses([]);
            setRecognizedEnglish("");
            setTranslatedText("");
            setAudioSrc(null);
            setIsGeneratingSentence(false);
            setIsTranslatingActive(true);
        }
    };

    // Trigger Multilingual translation & speech synthesis flow
    const handleTranslateAndSpeak = async () => {
        if (!recognizedEnglish || recognizedEnglish.trim() === "") return;

        setIsTranslatingText(true);
        setTranslatedText("");
        setAudioSrc(null);
        setIsPlaying(false);

        try {
            // 1. Fetch translation first (immediate feedback)
            const translateResponse = await fetch("/api/translate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    text: recognizedEnglish,
                    targetLanguage,
                    action: "translate"
                })
            });

            const translateData = await translateResponse.json();
            if (!translateResponse.ok) throw new Error(translateData.error || "Translation failed");

            const finalTranslated = translateData.translatedText;
            setTranslatedText(finalTranslated);
            setIsTranslatingText(false);

            // 2. Fetch TTS speech in the background
            setIsGeneratingSpeech(true);
            const ttsResponse = await fetch("/api/translate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    text: finalTranslated,
                    targetLanguage,
                    action: "tts"
                })
            });

            const ttsData = await ttsResponse.json();
            if (!ttsResponse.ok) throw new Error(ttsData.error || "Speech generation failed");

            // Convert base64 audio payload to standard audio source URL
            setAudioSrc(`data:audio/wav;base64,${ttsData.audioBase64}`);
        } catch (error) {
            console.error("[TranslatePage] Translation flow failed:", error);
            setTranslatedText("Failed to process translation. Please try again.");
        } finally {
            setIsTranslatingText(false);
            setIsGeneratingSpeech(false);
        }
    };

    // Manage HTML Audio Object Lifespan
    useEffect(() => {
        if (audioSrc) {
            const audioObj = new Audio(audioSrc);
            audioRef.current = audioObj;
            audioObj.onended = () => setIsPlaying(false);
        } else {
            audioRef.current = null;
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
            }
        };
    }, [audioSrc]);

    // Handle play / stop toggle on synthesized audio
    const togglePlayAudio = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
            audio.currentTime = 0;
            setIsPlaying(false);
        } else {
            audio.play()
                .then(() => setIsPlaying(true))
                .catch((e) => console.error("Playback error:", e));
        }
    };

    // Copy to clipboard helper
    const handleCopyToClipboard = (textToCopy: string) => {
        navigator.clipboard.writeText(textToCopy);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b border-border/40">
                <div className="flex w-full items-center justify-between gap-2 px-4">
                    {/* Left side */}
                    <div className="flex items-center gap-2">
                        <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
                        <Languages className="size-4 text-muted-foreground" />
                        <h1 className="text-lg font-semibold leading-none">
                            {isSignToText ? "Translate (Sign → Text/Speech)" : "Translate (Speech → Sign)"}
                        </h1>
                    </div>

                    {/* Right side toggle */}
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground hidden sm:inline font-medium">Mode</span>

                        <div className="flex items-center rounded-lg border bg-background p-1 shadow-sm">
                            <button
                                type="button"
                                onClick={() => handleModeSwitch("sign-to-text")}
                                className={[
                                    "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition",
                                    isSignToText ? "bg-muted text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                                ].join(" ")}
                                aria-pressed={isSignToText}
                            >
                                <Camera className="h-4 w-4" />
                                <span className="hidden sm:inline">Sign</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => handleModeSwitch("speech-to-sign")}
                                className={[
                                    "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition",
                                    !isSignToText ? "bg-muted text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                                ].join(" ")}
                                aria-pressed={!isSignToText}
                            >
                                <Mic className="h-4 w-4" />
                                <span className="hidden sm:inline">Speech</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex flex-1 flex-col px-4 pb-4 pt-6 bg-muted/10">
                <div className="mx-auto w-full max-w-6xl">
                    <div className="grid gap-6 lg:grid-cols-2">
                        {/* Left card: Camera OR Microphone */}
                        <section className="rounded-2xl border border-border/70 bg-background p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
                            <header className="mb-4 flex items-center justify-between border-b border-border/60 pb-3">
                                <h2 className="text-sm font-semibold tracking-tight text-foreground">
                                    {isSignToText ? "Webcam Input" : "Microphone"}
                                </h2>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                    {isSignToText ? "Mirror mode active" : "Speak clearly into your mic"}
                                </span>
                            </header>

                            <div className="flex flex-col justify-between">
                                {isSignToText ? (
                                    <>
                                        <CameraPreview
                                            isActive={isTranslatingActive}
                                            onTranslationStateChange={(state) => {
                                                setTranslationState(state);
                                                if (state === "ERROR" || state === "IDLE") {
                                                    setIsGeneratingSentence(false);
                                                }
                                            }}
                                            onWordDetected={(word) => setDetectedGlosses((prev) => [...prev, word])}
                                            onFinalTranslation={(sentence) => {
                                                setRecognizedEnglish(sentence);
                                                setIsGeneratingSentence(false);
                                            }}
                                        />

                                        {/* Action Controls for Sign-to-Text */}
                                        <div className="mt-5 flex flex-col gap-3">
                                            <div className="flex items-center justify-between gap-4">
                                                <Button
                                                    onClick={toggleTranslation}
                                                    className={[
                                                        "w-full rounded-xl py-5 font-semibold text-sm transition shadow-sm",
                                                        isTranslatingActive
                                                            ? "bg-red-600 hover:bg-red-700 text-white animate-pulse"
                                                            : "bg-green-400 hover:bg-brand-700 text-white"
                                                    ].join(" ")}
                                                >
                                                    {isTranslatingActive ? (
                                                        <>
                                                            <Square className="w-4 h-4 mr-2" /> Stop Live Translation
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Camera className="w-4 h-4 mr-2" /> Start Live Translation
                                                        </>
                                                    )}
                                                </Button>
                                            </div>

                                            {/* Live Word Scrolling Feed */}
                                            {isTranslatingActive && (
                                                <div className="border border-dashed border-border/80 rounded-xl p-4 bg-muted/10">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase flex items-center gap-1.5">
                                                            <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
                                                            Recognized Gloss Feed
                                                        </span>
                                                        <span className="text-[10px] text-muted-foreground px-2 py-0.5 rounded-full border border-border/60 bg-background font-mono font-bold uppercase">
                                                            {translationState}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none min-h-8">
                                                        {detectedGlosses.length === 0 ? (
                                                            <span className="text-xs text-muted-foreground italic">Performing gesture tracking...</span>
                                                        ) : (
                                                            detectedGlosses.map((g, i) => (
                                                                <span
                                                                    key={i}
                                                                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300 border border-brand-200 animate-in zoom-in duration-200"
                                                                >
                                                                    {g}
                                                                </span>
                                                            ))
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <div className="min-h-[300px] flex items-center justify-center">
                                        <AudioRecorderCard onRecordingComplete={setSpeechText} />
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Right card: Text result OR Avatar */}
                        <section className="rounded-2xl border border-border/70 bg-background p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
                                <header className="mb-4 flex items-center justify-between gap-3 border-b border-border/60 pb-3">
                                <h2 className="text-sm font-semibold tracking-tight text-foreground">
                                    {isSignToText ? "Translated Result" : "Sign Avatar"}
                                </h2>
                            </header>

                            {isSignToText ? (
                                <div className="flex flex-col gap-4">
                                    {/* Main English sentence output block */}
                                    {isGeneratingSentence ? (
                                        <div className="relative min-h-[140px] rounded-xl border border-dashed border-border/80 bg-muted/10 p-4 flex flex-col items-center justify-center gap-2">
                                            <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
                                            <span className="text-xs font-semibold text-muted-foreground animate-pulse">Generating natural sentence...</span>
                                        </div>
                                    ) : (
                                        <div className="relative min-h-[140px] rounded-xl border border-border/60 bg-muted/20 p-4 flex flex-col justify-between">
                                            <div className="w-full">
                                                <h3 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                                                    Recognized English Sentence
                                                </h3>
                                                <p className="text-foreground text-base leading-relaxed whitespace-pre-wrap font-medium">
                                                    {recognizedEnglish || "Waiting for sign translation..."}
                                                </p>
                                            </div>

                                            {recognizedEnglish && (
                                                <div className="mt-3 flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                                        onClick={() => handleCopyToClipboard(recognizedEnglish)}
                                                    >
                                                        {isCopied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Sarvam AI Multilingual translation panel */}
                                    {recognizedEnglish && (
                                        <div className="border border-border/60 rounded-xl p-4 bg-background shadow-sm">
                                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                                                <div className="flex-1">
                                                    <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                                                        Select Target Language
                                                    </label>
                                                    <select
                                                        className="w-full h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-brand-500 font-medium"
                                                        value={targetLanguage}
                                                        onChange={(e) => setTargetLanguage(e.target.value)}
                                                        disabled={isTranslatingText || isGeneratingSpeech}
                                                    >
                                                        {SARVAM_LANGUAGES.map((lang) => (
                                                            <option key={lang.code} value={lang.code}>
                                                                {lang.name} ({lang.code})
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="flex items-end">
                                                    <Button
                                                        onClick={handleTranslateAndSpeak}
                                                        disabled={isTranslatingText || isGeneratingSpeech}
                                                        className="w-full sm:w-auto h-9 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs flex items-center gap-2"
                                                    >
                                                        {isTranslatingText || isGeneratingSpeech ? (
                                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                        ) : (
                                                            <Volume2 className="w-3.5 h-3.5" />
                                                        )}
                                                        Translate & Speak
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* Translated Text & TTS Audio Player */}
                                            {(isTranslatingText || translatedText) && (
                                                <div className="mt-4 pt-4 border-t border-border/40 animate-in fade-in duration-300">
                                                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center justify-between">
                                                        <span>Target Translation</span>
                                                        {isGeneratingSpeech && (
                                                            <span className="flex items-center gap-1 text-[10px] text-amber-500 font-bold tracking-normal uppercase">
                                                                <Loader2 className="w-3 h-3 animate-spin" /> Generating speech...
                                                            </span>
                                                        )}
                                                    </h4>

                                                    {isTranslatingText ? (
                                                        <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
                                                            <Loader2 className="w-4 h-4 animate-spin text-brand-600" />
                                                            <span>Translating to language...</span>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <p className="text-foreground text-lg leading-relaxed font-semibold mb-4">
                                                                {translatedText}
                                                            </p>

                                                            {/* Audio Controls */}
                                                            {audioSrc && (
                                                                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                                                                    <div className="flex items-center gap-3">
                                                                        <Button
                                                                            onClick={togglePlayAudio}
                                                                            size="sm"
                                                                            className="h-8 rounded-md bg-brand-600 hover:bg-brand-700 text-white font-medium flex items-center gap-2"
                                                                        >
                                                                            {isPlaying ? (
                                                                                <>
                                                                                    <Square className="w-3.5 h-3.5" /> Stop
                                                                                </>
                                                                            ) : (
                                                                                <>
                                                                                    <Play className="w-3.5 h-3.5" /> Play Voice
                                                                                </>
                                                                            )}
                                                                        </Button>
                                                                        <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                                                                            Voice: Shreya
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex h-full flex-col justify-between gap-4" style={{ maxHeight: "340px" }}>
                                    <GlossVideoPlayer englishText={speechText} />
                                </div>
                            )}
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
}
