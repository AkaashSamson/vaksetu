"use client"

import * as React from "react"
import Image from "next/image"
import { ImageMCQQuestion } from "./types"

interface ImageMCQRendererProps {
    question: ImageMCQQuestion
    selectedOptionId: number | null
    onSelectOption: (optionId: number) => void
}

function glossImageUrlByName(name: string) {
    return `/glosses/${name}.jpg`
}

function optionLetter(index: number) {
    return String.fromCharCode("A".charCodeAt(0) + index)
}

export default function ImageMCQRenderer({
    question,
    selectedOptionId,
    onSelectOption,
}: ImageMCQRendererProps) {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="text-sm text-muted-foreground">Question {question.q_no}</div>
            <div className="mt-1 text-lg font-semibold text-foreground">{question.q_text}</div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {question.options.map((opt, optIndex) => {
                    const isSelected = selectedOptionId === opt.id
                    const letter = optionLetter(optIndex)
                    const src = opt.image_url ?? glossImageUrlByName(opt.name)

                    return (
                        <button
                            key={opt.id}
                            type="button"
                            onClick={() => onSelectOption(opt.id)}
                            className={[
                                "overflow-hidden rounded-xl border text-left transition duration-200 cursor-pointer bg-card",
                                isSelected
                                    ? "border-brand-500 ring-4 ring-brand-400/15"
                                    : "border-border hover:border-brand-400/60 hover:ring-4 hover:ring-brand-400/10",
                            ].join(" ")}
                        >
                            <div className="relative aspect-4/3 w-full bg-slate-950/20 dark:bg-slate-950/40">
                                <Image
                                    src={src}
                                    alt={`Option ${letter}`}
                                    fill
                                    className="object-contain"
                                    sizes="(min-width: 640px) 50vw, 100vw"
                                />
                                <div className="absolute left-3 top-3 rounded-full bg-brand-600 hover:bg-brand-700 px-2.5 py-1 text-xs font-semibold text-white transition-colors shadow-sm">
                                    {letter}
                                </div>
                            </div>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
