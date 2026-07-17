"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { Compass, ChevronLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PageHeader } from "@/components/shared/PageHeader"

import { QuizQuestion } from "@/components/quizzes/types"
import QuestionRenderer from "@/components/quizzes/QuestionRenderer"

type Difficulty = "EASY" | "MEDIUM" | "HARD"

type BaseQuiz = {
    id: string
    title: string
    description: string
    difficulty: Difficulty
    content?: {
        questions: any[]
    }
}

type Quiz = {
    id: string
    title: string
    description: string
    difficulty: Difficulty
    questions: QuizQuestion[]
}

/**
 * Adjust this ONE function to match how your files are named in /public/glosses.
 * Examples:
 *  - /public/glosses/S.jpg  -> return `/glosses/${name}.jpg`
 *  - /public/glosses/S.png  -> return `/glosses/${name}.png`
 */
function glossImageUrlByName(name: string) {
    return `/Glosses/${name}.jpg`
}


type AnswerMap = Record<number, number | null>

function computeResults(quiz: Quiz, answers: AnswerMap) {
    let correct = 0
    let wrong = 0
    let unanswered = 0

    for (const q of quiz.questions) {
        const selected = answers[q.q_no]
        if (selected == null) unanswered++
        else if (selected === q.correct_id) correct++
        else wrong++
    }

    return { correct, wrong, unanswered, total: quiz.questions.length }
}

function optionLetter(index: number) {
    return String.fromCharCode("A".charCodeAt(0) + index)
}

export default function QuizPage() {
    const params = useParams()
    const router = useRouter()
    const targetId = params?.id as string

    // Quizzes list state for "Next Quiz" database routing
    const [quizzesList, setQuizzesList] = React.useState<BaseQuiz[]>([])

    // Live Quiz State
    const [quiz, setQuiz] = React.useState<Quiz | null>(null)
    const [isLoading, setIsLoading] = React.useState(true)
    const [error, setError] = React.useState<string | null>(null)

    const [questionIndex, setQuestionIndex] = React.useState(0)
    const [answers, setAnswers] = React.useState<AnswerMap>({})
    const [showResults, setShowResults] = React.useState(false)
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const startTimeRef = React.useRef<number>(Date.now())
    const [submittedTimeTaken, setSubmittedTimeTaken] = React.useState<number>(0)
    const [liveElapsed, setLiveElapsed] = React.useState<number>(0)

    // Run timer while active
    React.useEffect(() => {
        if (showResults || !quiz) return

        setLiveElapsed(0)
        const interval = setInterval(() => {
            const duration = Math.max(0, Math.round((Date.now() - startTimeRef.current) / 1000))
            setLiveElapsed(duration)
        }, 1000)

        return () => clearInterval(interval)
    }, [showResults, quiz])

    function formatTime(seconds: number) {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    // Fetch Quizzes List for Navigation
    React.useEffect(() => {
        async function fetchList() {
            try {
                const res = await fetch(`/api/quiz`)
                if (!res.ok) throw new Error("Failed to fetch quizzes list")
                const data: BaseQuiz[] = await res.json()
                const sorted = data.sort((a,b) => a.title.localeCompare(b.title))
                setQuizzesList(sorted)
            } catch (err: any) {
                console.error("Failed to load quizzes list for play navigation:", err)
            }
        }
        fetchList()
    }, [])

    // Fetch Quiz Data on Mount
    React.useEffect(() => {
        if (!targetId) return

        async function fetchQuiz() {
            try {
                setIsLoading(true)
                const res = await fetch(`/api/quiz/${targetId}`)
                if (!res.ok) throw new Error("Failed to fetch quiz")
                const data: Quiz = await res.json()
                setQuiz(data)

                // Reset states for the new quiz
                setQuestionIndex(0)
                setAnswers(Object.fromEntries(data.questions.map((q) => [q.q_no, null])))
                setShowResults(false)
                startTimeRef.current = Date.now()
                setSubmittedTimeTaken(0)
            } catch (err: any) {
                console.error(err)
                setError(err.message)
            } finally {
                setIsLoading(false)
            }
        }

        fetchQuiz()
    }, [targetId])

    const results = React.useMemo(() => {
        if (!quiz) return { correct: 0, wrong: 0, unanswered: 0, total: 0 }
        return computeResults(quiz, answers)
    }, [quiz, answers])

    React.useEffect(() => {
        if (showResults && quiz) {
            const duration = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));
            setSubmittedTimeTaken(duration);
            const submitScore = async () => {
                setIsSubmitting(true);
                try {
                    await fetch(`/api/quiz/${quiz.id}/attempt`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            correct: results.correct,
                            wrong: results.wrong,
                            unanswered: results.unanswered,
                            total: results.total,
                            timeTaken: duration,
                            answers
                        })
                    });
                } catch (e) {
                    console.error("Failed to submit score", e);
                } finally {
                    setIsSubmitting(false);
                }
            };
            submitScore();
        }
    }, [showResults, quiz, results, answers]);

    const currentIndexInList = React.useMemo(() => {
        if (!quiz) return -1
        return quizzesList.findIndex(q => q.id === quiz.id)
    }, [quiz, quizzesList])

    if (isLoading) {
        return <div className="p-8 text-center text-muted-foreground">Loading quiz...</div>
    }

    if (error || !quiz) {
        return <div className="p-8 text-center text-red-500">Error: {error || "Quiz not found"}</div>
    }

    const progressPct = quiz ? Math.round(((questionIndex + 1) / quiz.questions.length) * 100) : 0
    const isLastQuestion = quiz ? questionIndex === quiz.questions.length - 1 : false

    function selectOption(qNo: number, optionId: number) {
        setAnswers((prev) => ({ ...prev, [qNo]: optionId }))
    }

    function nextQuestion() {
        if (quiz && questionIndex < quiz.questions.length - 1) setQuestionIndex((i) => i + 1)
        else setShowResults(true)
    }

    function prevQuestion() {
        if (questionIndex > 0) setQuestionIndex((i) => i - 1)
    }

    function resetQuizAttempt() {
        if (!quiz) return
        setQuestionIndex(0)
        setAnswers(Object.fromEntries(quiz.questions.map((q) => [q.q_no, null])))
        setShowResults(false)
        startTimeRef.current = Date.now()
        setSubmittedTimeTaken(0)
    }

    const hasNextQuiz = currentIndexInList !== -1 && currentIndexInList < quizzesList.length - 1
    const canGoNextQuiz = results.correct >= Math.ceil(results.total / 2)

    function goToNextQuiz() {
        if (!hasNextQuiz || currentIndexInList === -1) return
        const nextQuiz = quizzesList[currentIndexInList + 1]
        router.push(`/explore/quiz/${nextQuiz.id}`)
    }

    const header = (
        <PageHeader 
            title="Quizzes" 
            icon={Compass} 
            rightContent={
                <div className="flex items-center gap-3">
                    {!showResults && quiz && (
                        <div className="flex items-center gap-1.5 text-xs font-semibold bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-400 px-2.5 py-1.5 rounded-full border border-brand-200/40">
                            <span className="relative flex h-1.5 w-1.5 mr-1">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-500"></span>
                            </span>
                            {formatTime(liveElapsed)}
                        </div>
                    )}
                    {!showResults && quiz && (
                        <Button 
                            variant="outline" 
                            size="sm"
                            className="text-muted-foreground hover:text-foreground hover:bg-muted flex items-center gap-1 rounded-xl border border-input"
                            asChild
                        >
                            <Link href="/explore/quiz">
                                <ChevronLeft className="size-4" />
                                <span>Exit Quiz</span>
                            </Link>
                        </Button>
                    )}
                </div>
            }
        />
    )

    if (showResults) {
        return (
            <>
                {header}

                <div className="flex flex-1 flex-col p-4 pt-0">
                    <div className="mx-auto w-full max-w-3xl">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <h2 className="text-2xl font-semibold">Results</h2>
                                <p className="text-sm text-muted-foreground">{quiz.title}</p>
                            </div>
                            <div className="text-sm text-muted-foreground">
                                {results.correct}/{results.total} correct
                            </div>
                        </div>

                        <Card className="mt-4 border-brand-500/30 p-5">
                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="rounded-lg border border-brand-500/30 bg-brand-500/5 p-4">
                                    <div className="text-sm text-muted-foreground">Correct</div>
                                    <div className="text-3xl font-semibold text-brand-600">{results.correct}</div>
                                </div>

                                <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
                                    <div className="text-sm text-muted-foreground">Wrong</div>
                                    <div className="text-3xl font-semibold">{results.wrong}</div>
                                </div>

                                <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
                                    <div className="text-sm text-muted-foreground">Time Taken</div>
                                    <div className="text-3xl font-semibold text-blue-600">{submittedTimeTaken}s</div>
                                </div>

                                <div className="rounded-lg border p-4">
                                    <div className="text-sm text-muted-foreground">Total</div>
                                    <div className="text-3xl font-semibold">{results.total}</div>
                                </div>
                            </div>

                            {!canGoNextQuiz ? (
                                <p className="mt-4 text-sm text-muted-foreground">
                                    Score at least{" "}
                                    <span className="font-medium text-brand-700">{Math.ceil(results.total / 2)}</span>{" "}
                                    correct to unlock the next quiz.
                                </p>
                            ) : null}

                            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                                <Button
                                    variant="secondary"
                                    onClick={resetQuizAttempt}
                                    className="border border-brand-500/30"
                                >
                                    Try again
                                </Button>

                                <Button asChild className="bg-brand-600 hover:bg-brand-700">
                                    <Link href="/explore/leaderboard">Visit leaderboard</Link>
                                </Button>

                                <Button
                                    onClick={goToNextQuiz}
                                    className="bg-brand-600 hover:bg-brand-700"
                                    disabled={!hasNextQuiz || !canGoNextQuiz}
                                >
                                    Next
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            {header}

            <div className="flex flex-1 flex-col p-4 pt-0">
                <div className="mx-auto w-full max-w-3xl">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <h2 className="text-2xl font-semibold">{quiz.title}</h2>
                            <p className="text-sm text-muted-foreground">{quiz.description}</p>
                        </div>
                        <div className="text-sm text-muted-foreground text-right">
                            <div className="font-medium">Q{questionIndex + 1}/{quiz.questions.length}</div>
                        </div>
                    </div>

                    <div className="mt-3">
                        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                            <div
                                className="h-full rounded-full bg-brand-600 transition-[width] duration-300 ease-out"
                                style={{ width: `${progressPct}%` }}
                            />
                        </div>
                        <div className="mt-1 text-right text-xs text-muted-foreground">{progressPct}%</div>
                    </div>

                    <Card className="mt-4 p-5 animate-in fade-in duration-300 bg-card/65 backdrop-blur-md border border-slate-500/10">
                        {(() => {
                            const current = quiz.questions[questionIndex]
                            const selected = answers[current.q_no]

                            return (
                                <QuestionRenderer
                                    question={current}
                                    selectedOptionId={selected}
                                    onSelectOption={(optionId) => selectOption(current.q_no, optionId)}
                                    isPriority={questionIndex === 0}
                                />
                            )
                        })()}

                        <div className="mt-6 flex items-center justify-between gap-3 border-t border-border pt-4">
                            <Button 
                                variant="secondary" 
                                onClick={prevQuestion} 
                                disabled={questionIndex === 0}
                                className="rounded-xl border border-input cursor-pointer"
                            >
                                Back
                            </Button>

                            <div className="flex items-center gap-2">
                                <Button 
                                    variant="ghost" 
                                    onClick={resetQuizAttempt}
                                    className="rounded-xl cursor-pointer hover:bg-muted"
                                >
                                    Reset
                                </Button>

                                <Button 
                                    onClick={nextQuestion} 
                                    className="bg-brand-600 hover:bg-brand-700 text-white rounded-xl shadow-sm px-5 cursor-pointer font-medium"
                                >
                                    {isLastQuestion ? "Finish" : "Next"}
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </>
    )
}