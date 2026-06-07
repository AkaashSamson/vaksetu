"use client";

import React, { useState, useEffect, useRef } from "react";
import { fetchGlossesFromText } from "@/lib/api/gloss";
import { Loader2, Play, Pause } from "lucide-react";

type Props = {
    englishText: string;
};

export function GlossVideoPlayer({ englishText }: Props) {
    const [glossList, setGlossList] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSpellingFallback, setIsSpellingFallback] = useState<boolean>(false);
    const [isPlaying, setIsPlaying] = useState<boolean>(true);

    useEffect(() => {
        if (!englishText) {
            // No text → stop & clear
            setGlossList([]);
            setCurrentIndex(0);
            setIsPlaying(false);
            setIsSpellingFallback(false);
            return;
        }

        const fetchMapping = async () => {
            setIsLoading(true);
            try {
                const glosses = await fetchGlossesFromText(englishText);
                setGlossList(glosses);
                setCurrentIndex(0);
                // Ensure we ALWAYS start playing when a new translation arrives:
                setIsPlaying(true);
                // If we previously fell back to spelling, clear that for the new mapping
                setIsSpellingFallback(false);
            } catch (err) {
                console.error("Failed to map text to glosses", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMapping();
    }, [englishText]);

    const videoRef = useRef<HTMLVideoElement | null>(null);
    const gapTimerRef = useRef<number | null>(null);

    const handleVideoEnd = () => {
        if (glossList.length === 0) return;
        const nextIndex = currentIndex + 1;
        if (nextIndex >= glossList.length) {
            setTimeout(() => setCurrentIndex(0), 1500);
        } else {
            setCurrentIndex(nextIndex);
        }
    };

    const handleVideoError = () => {
        if (!glossList[currentIndex]) return;

        const failingWord = glossList[currentIndex];

        if (failingWord.length === 1) {
            console.warn(`Critical missing alphabet asset: ${failingWord}.mp4. Skipping.`);
            handleVideoEnd();
            return;
        }

        console.log(`Video asset for "${failingWord}" missing. Falling back to Fingerspelling sequence.`);
        setIsSpellingFallback(true);

        const letters = failingWord.split("");
        const newSegment = [...letters, "__GAP__"];

        const newList = [...glossList];
        newList.splice(currentIndex, 1, ...newSegment);

        setGlossList(newList);
    };

    useEffect(() => {
        if (glossList[currentIndex] === "__GAP__") {
            setIsSpellingFallback(false);
            if (isPlaying) {
                gapTimerRef.current = window.setTimeout(() => {
                    handleVideoEnd();
                }, 800);
            }
            return () => {
                if (gapTimerRef.current) clearTimeout(gapTimerRef.current);
            };
        }
    }, [currentIndex, glossList, isPlaying]);

    useEffect(() => {
        if (!videoRef.current || glossList[currentIndex] === "__GAP__") return;

        if (isPlaying) {
            videoRef.current.play().catch(() => {});
        } else {
            videoRef.current.pause();
        }
    }, [currentIndex, glossList, isPlaying]);

    if (!englishText) {
        return (
            <div className="flex h-full min-h-60 flex-col items-center justify-center rounded-lg bg-muted/40 p-4 border border-dashed text-muted-foreground text-sm">
                Waiting for speech...
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex h-full min-h-60 flex-col items-center justify-center rounded-lg bg-muted/20 p-4 border text-muted-foreground space-y-3">
                <Loader2 className="h-6 w-6 animate-spin text-brand-600" />
                <p className="text-sm">Mapping Glosses directly securely...</p>
            </div>
        );
    }

    const currentGloss = glossList[currentIndex];
    const isGap = currentGloss === "__GAP__";

    return (
        <div className="flex flex-col items-center overflow-hidden rounded-lg bg-card border border-brand-600/20 pb-2 h-full min-h-[300px] w-full shadow-sm">
            {/* Status Header */}
            <div className="w-full bg-brand-50/50 dark:bg-brand-900/10 px-4 py-1.5 flex items-center justify-between text-xs text-muted-foreground border-b border-brand-600/10">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="p-1.5 rounded-full transition-colors flex items-center justify-center border border-brand-200 dark:border-brand-800 bg-white dark:bg-zinc-900 hover:bg-brand-50 dark:hover:bg-brand-900/40 text-brand-700 dark:text-brand-400 shadow-sm"
                        title={isPlaying ? "Pause Sequence" : "Play Sequence"}
                    >
                        {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 ml-0.5" />}
                    </button>
                    <span className="font-medium">Playing Index {currentIndex + 1} / {glossList.length}</span>
                </div>
                {isSpellingFallback && (
                    <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50 px-2 py-0.5 rounded font-mono">Fingerspelling Mode</span>
                )}
            </div>

            {/* Video Player Frame */}
            <div className="flex flex-col items-center justify-start pt-2 flex-1 w-full bg-muted/5 min-h-[250px] relative">
                {isGap ? (
                    <div className="animate-pulse text-muted-foreground tracking-wider text-sm font-mono flex items-center gap-2">
                        <span>[ WORD BREAK ]</span>
                    </div>
                ) : (
                    currentGloss && (
                        <video
                            ref={videoRef}
                            src={`/Glosses/Videos/assets/${currentGloss}.mp4`}
                            autoPlay
                            muted
                            playsInline
                            className="w-[80%] h-auto max-h-[300px] object-contain mx-auto rounded-md"
                            onEnded={handleVideoEnd}
                            onError={handleVideoError}
                        />
                    )
                )}
            </div>

            {/* Reduced gap between video and label: mt-2 and smaller vertical padding */}
            <div className="mt-1 px-4 py-1 text-center bg-brand-100 dark:bg-brand-900/30 rounded-full border border-brand-200 dark:border-brand-800/50 mx-auto shadow-sm">
                <p className="text-sm font-semibold tracking-wide text-brand-800 dark:text-brand-300 min-w-16">
                    {isGap ? "..." : (currentGloss || "")}
                </p>
            </div>
        </div>
    );
}
