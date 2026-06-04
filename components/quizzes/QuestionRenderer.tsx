"use client"

import * as React from "react"
import { QuizQuestion } from "./types"
import ImageMCQRenderer from "./ImageMCQRenderer"
import SignMCQRenderer from "./SignMCQRenderer"

interface QuestionRendererProps {
    question: QuizQuestion
    selectedOptionId: number | null
    onSelectOption: (optionId: number) => void
    isPriority?: boolean
}

export default function QuestionRenderer({
    question,
    selectedOptionId,
    onSelectOption,
    isPriority = false,
}: QuestionRendererProps) {
    switch (question.type) {
        case "image_mcq":
            return (
                <ImageMCQRenderer
                    question={question}
                    selectedOptionId={selectedOptionId}
                    onSelectOption={onSelectOption}
                />
            )
        case "sign_mcq":
            return (
                <SignMCQRenderer
                    question={question}
                    selectedOptionId={selectedOptionId}
                    onSelectOption={onSelectOption}
                    isPriority={isPriority}
                />
            )
        default:
            return (
                <div className="p-8 text-center border border-dashed border-red-500/30 rounded-xl bg-red-500/5 text-red-500 animate-in fade-in duration-200">
                    <p className="font-semibold">Unknown Question Type: &quot;{(question as any).type || "unknown"}&quot;</p>
                    <p className="text-sm text-muted-foreground mt-1">
                        Please implement a rendering component for this type and register it in QuestionRenderer.tsx.
                    </p>
                </div>
            )
    }
}
