"use client"

import * as React from "react"
import { Camera, Square, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CameraPreview } from "./camera-preview"
import { GlossFeed } from "./gloss-feed"
import { EnglishResultCard } from "./english-result-card"
import { useSignStream } from "@/hooks/use-sign-stream"

type SignTranslatorProps = {
    onEnglishSentenceChange?: (sentence: string) => void
}

export function SignTranslator({ onEnglishSentenceChange }: SignTranslatorProps) {
    const videoRef = React.useRef<HTMLVideoElement | null>(null)
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null)

    const {
        translationState,
        detectedGlosses,
        recognizedEnglish,
        isSynthesizing,
        errorMessage,
        startTranslation,
        stopTranslation
    } = useSignStream()

    // Pass recognized English up to parent whenever it changes
    React.useEffect(() => {
        onEnglishSentenceChange?.(recognizedEnglish)
    }, [recognizedEnglish, onEnglishSentenceChange])

    const isTranslatingActive = translationState === "TRANSLATING" || translationState === "CONNECTING"

    const toggleTranslation = () => {
        if (isTranslatingActive) {
            stopTranslation()
        } else {
            void startTranslation(videoRef.current, canvasRef.current)
        }
    }

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            {/* Left card: Webcam Input & Controls */}
            <section className="rounded-2xl border border-border/70 bg-background p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
                <header className="mb-4 flex items-center justify-between border-b border-border/60 pb-3">
                    <h2 className="text-sm font-semibold tracking-tight text-foreground">
                        Webcam Input
                    </h2>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Mirror mode active
                    </span>
                </header>

                <div className="flex flex-col justify-between">
                    <CameraPreview
                        videoRef={videoRef}
                        canvasRef={canvasRef}
                    />

                    {errorMessage && (
                        <div className="mt-3 flex items-center gap-2 rounded-lg bg-red-500/10 p-3 text-xs text-red-600 dark:text-red-400 border border-red-500/20">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{errorMessage}</span>
                        </div>
                    )}

                    <div className="mt-5 flex flex-col gap-3">
                        <Button
                            onClick={toggleTranslation}
                            disabled={translationState === "CONNECTING"}
                            className={[
                                "w-full rounded-xl py-5 font-semibold text-sm transition shadow-sm",
                                isTranslatingActive
                                    ? "bg-red-600 hover:bg-red-700 text-white animate-pulse"
                                    : "bg-brand-600 hover:bg-brand-700 text-white"
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

                        <GlossFeed glosses={detectedGlosses} state={translationState} />
                    </div>
                </div>
            </section>

            {/* Right card: Translated Result Output */}
            <section className="rounded-2xl border border-border/70 bg-background p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
                <header className="mb-4 flex items-center justify-between gap-3 border-b border-border/60 pb-3">
                    <h2 className="text-sm font-semibold tracking-tight text-foreground">
                        Translated Result
                    </h2>
                </header>

                <div className="flex flex-col gap-4">
                    <EnglishResultCard
                        recognizedEnglish={recognizedEnglish}
                        isSynthesizing={isSynthesizing}
                    />
                </div>
            </section>
        </div>
    )
}
