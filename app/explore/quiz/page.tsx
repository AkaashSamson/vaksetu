"use client"

import * as React from "react"
import Link from "next/link"
import { Compass } from "lucide-react"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

type QuizOption = {
    id: string
    label: string
}

type QuizQuestion = {
    id: string
    prompt: string
    options: QuizOption[]
    correctOptionId: string
}

const DUMMY_QUIZ: QuizQuestion[] = [
    {
        id: "q1",
        prompt: "Which sign best matches the word “Hello”?",
        options: [
            { id: "a", label: "Wave hand near head" },
            { id: "b", label: "Tap chin twice" },
            { id: "c", label: "Point upward" },
            { id: "d", label: "Cross arms" },
        ],
        correctOptionId: "a",
    },
    {
        id: "q2",
        prompt: "Which option is most likely the sign for “Thank you”?",
        options: [
            { id: "a", label: "Thumbs up" },
            { id: "b", label: "Hand from chin outward" },
            { id: "c", label: "Clap twice" },
            { id: "d", label: "Tap shoulder" },
        ],
        correctOptionId: "b",
    },
    {
        id: "q3",
        prompt: "Pick the best match for the sign meaning “Yes” (ASL).",
        options: [
            { id: "a", label: "Open palm forward" },
            { id: "b", label: "Closed fist nodding" },
            { id: "c", label: "Point to ear" },
            { id: "d", label: "Finger snap" },
        ],
        correctOptionId: "b",
    },
    {
        id: "q4",
        prompt: "Which is closest to the sign for “No” (ASL)?",
        options: [
            { id: "a", label: "Index finger wag" },
            { id: "b", label: "Closed fist nod" },
            { id: "c", label: "Thumbs up" },
            { id: "d", label: "Tap forehead" },
        ],
        correctOptionId: "a",
    },
    {
        id: "q5",
        prompt: "Choose the best match for “Help”.",
        options: [
            { id: "a", label: "Hand from chin outward" },
            { id: "b", label: "Thumb-up on palm, lift upward" },
            { id: "c", label: "Wave near head" },
            { id: "d", label: "Tap shoulder twice" },
        ],
        correctOptionId: "b",
    },
]

type AnswerMap = Record<string, string | null> // questionId -> optionId

function computeResults(questions: QuizQuestion[], answers: AnswerMap) {
    let correct = 0
    let wrong = 0
    let unanswered = 0

    for (const q of questions) {
        const selected = answers[q.id]
        if (!selected) {
            unanswered++
            continue
        }
        if (selected === q.correctOptionId) correct++
        else wrong++
    }

    return { correct, wrong, unanswered, total: questions.length }
}

export default function QuizPage() {
    const questions = DUMMY_QUIZ

    const [index, setIndex] = React.useState(0)
    const [answers, setAnswers] = React.useState<AnswerMap>(() =>
        Object.fromEntries(questions.map((q) => [q.id, null]))
    )
    const [showResults, setShowResults] = React.useState(false)

    const current = questions[index]
    const selected = answers[current.id]
    const results = React.useMemo(() => computeResults(questions, answers), [answers, questions])

    function selectOption(optionId: string) {
        setAnswers((prev) => ({ ...prev, [current.id]: optionId }))
    }

    function next() {
        if (index < questions.length - 1) setIndex((i) => i + 1)
        else setShowResults(true)
    }

    function prev() {
        if (index > 0) setIndex((i) => i - 1)
    }

    function reset() {
        setIndex(0)
        setAnswers(Object.fromEntries(questions.map((q) => [q.id, null])))
        setShowResults(false)
    }

    return (
        <>
            {/* Header consistent with your app */}
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                <div className="flex items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
                    <Compass className="size-4 text-muted-foreground" />
                    <h1 className="text-lg font-semibold leading-none">Quiz</h1>
                </div>
            </header>

            <div className="flex flex-1 flex-col p-4 pt-0">
                <div className="mx-auto w-full max-w-3xl">
                    {showResults ? (
                        <>
                            <div className="flex items-center justify-between gap-3">
                                <h2 className="text-2xl font-semibold">Results</h2>
                                <div className="text-sm text-muted-foreground">
                                    {results.correct}/{results.total} correct
                                </div>
                            </div>

                            <Card className="mt-4 border-green-500/30 p-5">
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-4">
                                        <div className="text-sm text-muted-foreground">Correct</div>
                                        <div className="text-3xl font-semibold text-green-600">{results.correct}</div>
                                    </div>

                                    <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
                                        <div className="text-sm text-muted-foreground">Wrong</div>
                                        <div className="text-3xl font-semibold">{results.wrong}</div>
                                    </div>

                                    <div className="rounded-lg border p-4">
                                        <div className="text-sm text-muted-foreground">Unanswered</div>
                                        <div className="text-3xl font-semibold">{results.unanswered}</div>
                                    </div>

                                    <div className="rounded-lg border p-4">
                                        <div className="text-sm text-muted-foreground">Total</div>
                                        <div className="text-3xl font-semibold">{results.total}</div>
                                    </div>
                                </div>

                                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                                    <Button
                                        variant="secondary"
                                        onClick={reset}
                                        className="border border-green-500/30"
                                    >
                                        Try again
                                    </Button>

                                    <Button asChild className="bg-green-600 hover:bg-green-700">
                                        <Link href="/explore/leaderboard">Visit leaderboard</Link>
                                    </Button>
                                </div>
                            </Card>

                            {/* Optional (remove later): shows backend-friendly payload */}
                            <pre className="mt-4 overflow-auto rounded-lg border bg-muted/40 p-3 text-xs text-muted-foreground">
                {JSON.stringify(
                    {
                        quizId: "dummy-quiz-1",
                        answers,
                        results,
                    },
                    null,
                    2
                )}
              </pre>
                        </>
                    ) : (
                        <>
                            <div className="flex items-center justify-between gap-3">
                                <h2 className="text-2xl font-semibold">Quick Quiz</h2>
                                <div className="text-sm text-muted-foreground">
                                    Question {index + 1} of {questions.length}
                                </div>
                            </div>

                            <Card className="mt-4 p-5">
                                <div className="text-lg font-semibold">{current.prompt}</div>

                                <div className="mt-4 grid gap-3">
                                    {current.options.map((opt) => {
                                        const isSelected = selected === opt.id
                                        return (
                                            <button
                                                key={opt.id}
                                                type="button"
                                                onClick={() => selectOption(opt.id)}
                                                className={[
                                                    "w-full rounded-lg border p-4 text-left transition",
                                                    isSelected
                                                        ? "border-green-500 bg-green-500/10"
                                                        : "hover:border-green-400/60 hover:bg-muted",
                                                ].join(" ")}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div
                                                        className={[
                                                            "mt-0.5 flex size-7 items-center justify-center rounded-full border text-xs font-semibold",
                                                            isSelected
                                                                ? "border-green-500 text-green-600"
                                                                : "text-muted-foreground",
                                                        ].join(" ")}
                                                    >
                                                        {opt.id.toUpperCase()}
                                                    </div>
                                                    <div className="text-base">{opt.label}</div>
                                                </div>
                                            </button>
                                        )
                                    })}
                                </div>

                                <div className="mt-6 flex items-center justify-between gap-3">
                                    <Button variant="secondary" onClick={prev} disabled={index === 0}>
                                        Back
                                    </Button>

                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" onClick={reset}>
                                            Reset
                                        </Button>
                                        <Button
                                            onClick={next}
                                            className="bg-green-600 hover:bg-green-700"
                                            disabled={!selected} // require an answer (optional)
                                        >
                                            {index === questions.length - 1 ? "Finish" : "Next"}
                                        </Button>
                                    </div>
                                </div>
                            </Card>

                            {/* Optional (remove later): backend-friendly payload */}
                            <pre className="mt-4 overflow-auto rounded-lg border bg-muted/40 p-3 text-xs text-muted-foreground">
                {JSON.stringify(
                    {
                        quizId: "dummy-quiz-1",
                        currentQuestionId: current.id,
                        answers,
                    },
                    null,
                    2
                )}
              </pre>
                        </>
                    )}
                </div>
            </div>
        </>
    )
}