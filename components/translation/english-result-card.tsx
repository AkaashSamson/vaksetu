"use client"

import * as React from "react"
import { Loader2, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

type EnglishResultCardProps = {
    recognizedEnglish: string
    isSynthesizing: boolean
}

export function EnglishResultCard({ recognizedEnglish, isSynthesizing }: EnglishResultCardProps) {
    const [isCopied, setIsCopied] = React.useState(false)

    const handleCopyToClipboard = (textToCopy: string) => {
        if (!textToCopy) return
        navigator.clipboard.writeText(textToCopy)
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000)
    }

    if (isSynthesizing) {
        return (
            <div className="relative min-h-[140px] rounded-xl border border-dashed border-border/80 bg-muted/10 p-4 flex flex-col items-center justify-center gap-2">
                <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
                <span className="text-xs font-semibold text-muted-foreground animate-pulse">
                    Synthesizing natural English sentence...
                </span>
            </div>
        )
    }

    return (
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
    )
}
