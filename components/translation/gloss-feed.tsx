"use client"

import * as React from "react"
import { TranslationState } from "@/lib/mediapipe/types"

type GlossFeedProps = {
    glosses: string[]
    state: TranslationState
}

export function GlossFeed({ glosses, state }: GlossFeedProps) {
    const isVisible = state === "TRANSLATING" || state === "CONNECTING" || glosses.length > 0;
    if (!isVisible) return null;

    return (
        <div className="border border-dashed border-border/80 rounded-xl p-4 bg-muted/10 mt-3">
            <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase flex items-center gap-1.5">
                    {state === "TRANSLATING" && (
                        <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
                    )}
                    Recognized Gloss Feed
                </span>
                <span className="text-[10px] text-muted-foreground px-2 py-0.5 rounded-full border border-border/60 bg-background font-mono font-bold uppercase">
                    {state}
                </span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none min-h-8">
                {glosses.length === 0 ? (
                    <span className="text-xs text-muted-foreground italic">Performing gesture tracking...</span>
                ) : (
                    glosses.map((g, i) => (
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
    )
}
