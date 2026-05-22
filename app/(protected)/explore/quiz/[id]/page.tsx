"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { Compass, ChevronLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PageHeader } from "@/components/shared/PageHeader"

type Difficulty = "EASY" | "MEDIUM" | "HARD"

type BaseQuiz = {
    id: string
    title: string
    description: string
    difficulty: Difficulty
    type: "image_mcq" | "sign_mcq"
}

type ImageMCQQuestion = {
    q_no: number
    q_text: string
    correct_id: number
    options: { id: number; image_url?: string; name: string }[]
}

type SignMCQQuestion = {
    q_no: number
    question_image: string
    correct_id: number
    options: { id: number; name: string }[]
}

type ImageMCQ = BaseQuiz & {
    type: "image_mcq"
    questions: ImageMCQQuestion[]
}

type SignMCQ = BaseQuiz & {
    type: "sign_mcq"
    questions: SignMCQQuestion[]
}

type Quiz = ImageMCQ | SignMCQ

/**
 * Adjust this ONE function to match how your files are named in /public/glosses.
 * Examples:
 *  - /public/glosses/S.jpg  -> return `/glosses/${name}.jpg`
 *  - /public/glosses/S.png  -> return `/glosses/${name}.png`
 */
function glossImageUrlByName(name: string) {
    return `/glosses/${name}.jpg`
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
                        <div className="flex items-center gap-1.5 text-xs font-semibold bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400 px-2.5 py-1.5 rounded-full border border-green-200/40">
                            <span className="relative flex h-1.5 w-1.5 mr-1">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
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
                                    <span className="font-medium text-green-700">{Math.ceil(results.total / 2)}</span>{" "}
                                    correct to unlock the next quiz.
                                </p>
                            ) : null}

                            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                                <Button
                                    variant="secondary"
                                    onClick={resetQuizAttempt}
                                    className="border border-green-500/30"
                                >
                                    Try again
                                </Button>

                                <Button asChild className="bg-green-600 hover:bg-green-700">
                                    <Link href="/explore/leaderboard">Visit leaderboard</Link>
                                </Button>

                                <Button
                                    onClick={goToNextQuiz}
                                    className="bg-green-600 hover:bg-green-700"
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
                                className="h-full rounded-full bg-green-600 transition-[width] duration-300 ease-out"
                                style={{ width: `${progressPct}%` }}
                            />
                        </div>
                        <div className="mt-1 text-right text-xs text-muted-foreground">{progressPct}%</div>
                    </div>

                    <Card className="mt-4 p-5">
                        {quiz.type === "image_mcq" ? (
                            (() => {
                                const current = quiz.questions[questionIndex]
                                const selected = answers[current.q_no]

                                return (
                                    <>
                                        <div className="text-sm text-muted-foreground">Question {current.q_no}</div>
                                        <div className="mt-1 text-lg font-semibold">{current.q_text}</div>

                                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                            {current.options.map((opt, optIndex) => {
                                                const isSelected = selected === opt.id
                                                const letter = optionLetter(optIndex)

                                                // If backend provides image_url later, it will use that.
                                                // Otherwise, we derive it from gloss name based on /public/glosses.
                                                const src = opt.image_url ?? glossImageUrlByName(opt.name)

                                                return (
                                                    <button
                                                        key={opt.id}
                                                        type="button"
                                                        onClick={() => selectOption(current.q_no, opt.id)}
                                                        className={[
                                                            "overflow-hidden rounded-xl border text-left transition",
                                                            isSelected
                                                                ? "border-green-500 ring-4 ring-green-400/15 px-2.5"
                                                                : "hover:border-green-400/60 hover:ring-4 hover:ring-green-400/10",
                                                        ].join(" ")}
                                                    >
                                                        <div className="relative aspect-4/3 w-full bg-gray-900">
                                                            <Image
                                                                src={src}
                                                                alt={`Option ${letter}`}
                                                                fill
                                                                className="object-contain"
                                                                sizes="(min-width: 640px) 50vw, 100vw"
                                                            />
                                                            <div className="absolute left-3 top-3 rounded-full bg-green-600 px-2.5 py-1 text-xs font-semibold text-white">
                                                                {letter}
                                                            </div>
                                                        </div>
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </>
                                )
                            })()
                        ) : (
                            (() => {
                                const current = quiz.questions[questionIndex]
                                const selected = answers[current.q_no]

                                return (
                                    <>
                                        <div className="text-sm text-muted-foreground">Question {current.q_no}</div>

                                        <div className="mt-4 overflow-hidden rounded-xl border border-green-500/30 bg-muted">
                                            <div className="relative aspect-video w-full bg-gray-900">
                                                <Image
                                                    src={current.question_image}
                                                    alt={`Question ${current.q_no}`}
                                                    fill
                                                    className="object-contain"
                                                    sizes="100vw"
                                                    priority={questionIndex === 0}
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-4 grid gap-3">
                                            {current.options.map((opt) => {
                                                const isSelected = selected === opt.id
                                                return (
                                                    <button
                                                        key={opt.id}
                                                        type="button"
                                                        onClick={() => selectOption(current.q_no, opt.id)}
                                                        className={[
                                                            "w-full rounded-lg border p-4 text-left transition",
                                                            isSelected
                                                                ? "border-green-500 bg-green-500/10"
                                                                : "hover:border-green-400/60 hover:bg-muted",
                                                        ].join(" ")}
                                                    >
                                                        <div className="flex items-center justify-between gap-3">
                                                            <div className="text-base font-medium">{opt.name}</div>
                                                        </div>
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </>
                                )
                            })()
                        )}

                        <div className="mt-6 flex items-center justify-between gap-3">
                            <Button variant="secondary" onClick={prevQuestion} disabled={questionIndex === 0}>
                                Back
                            </Button>

                            <div className="flex items-center gap-2">
                                <Button variant="ghost" onClick={resetQuizAttempt}>
                                    Reset
                                </Button>

                                <Button onClick={nextQuestion} className="bg-green-600 hover:bg-green-700">
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