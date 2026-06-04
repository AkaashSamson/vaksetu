"use client"

import * as React from "react"
import Image from "next/image"
import { SignMCQQuestion } from "./types"

interface SignMCQRendererProps {
    question: SignMCQQuestion
    selectedOptionId: number | null
    onSelectOption: (optionId: number) => void
    isPriority: boolean
}

export default function SignMCQRenderer({
    question,
    selectedOptionId,
    onSelectOption,
    isPriority,
}: SignMCQRendererProps) {
    const questionImage = question.question_image ?? ""

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="text-sm text-muted-foreground">Question {question.q_no}</div>

            <div className="mt-4 overflow-hidden rounded-xl border border-brand-500/30 bg-slate-900/5 dark:bg-slate-950/20 shadow-inner">
                <div className="relative aspect-video w-full bg-slate-950/90 rounded-xl overflow-hidden">
                    {questionImage ? (
                        <Image
                            src={questionImage}
                            alt={`Question Sign ${question.q_no}`}
                            fill
                            className="object-contain"
                            sizes="100vw"
                            priority={isPriority}
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
                            Image not available
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-4 grid gap-3">
                {question.options.map((opt) => {
                    const isSelected = selectedOptionId === opt.id
                    return (
                        <button
                            key={opt.id}
                            type="button"
                            onClick={() => onSelectOption(opt.id)}
                            className={[
                                "w-full rounded-xl border p-4 text-left transition duration-200 cursor-pointer bg-card",
                                isSelected
                                    ? "border-brand-500 bg-brand-500/10 text-brand-700 dark:text-brand-400 font-semibold ring-2 ring-brand-500/20"
                                    : "border-border hover:border-brand-400/60 hover:bg-muted text-foreground",
                            ].join(" ")}
                        >
                            <div className="flex items-center justify-between gap-3">
                                <div className="text-base font-medium">{opt.name}</div>
                            </div>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
