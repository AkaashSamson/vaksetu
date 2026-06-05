"use client"

import * as React from "react"
import { Compass } from "lucide-react"
import { useRouter } from "next/navigation"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/shared/PageHeader"

type Difficulty = "EASY" | "MEDIUM" | "HARD"

type BaseQuiz = {
    id: string
    title: string
    description: string
    difficulty: Difficulty
    content: {
        questions: any[]
    }
}

export default function QuizPage() {
    const router = useRouter()

    const [quizzesList, setQuizzesList] = React.useState<BaseQuiz[]>([])
    const [isLoadingList, setIsLoadingList] = React.useState(true)
    const [listError, setListError] = React.useState<string | null>(null)

    React.useEffect(() => {
        async function fetchList() {
            try {
                setIsLoadingList(true)
                const res = await fetch(`/api/quizzes`)
                if (!res.ok) throw new Error("Failed to fetch quizzes")
                const data: BaseQuiz[] = await res.json()

                const sorted = data.sort((a, b) => a.title.localeCompare(b.title))
                setQuizzesList(sorted)
            } catch (err: any) {
                console.error(err)
                setListError(err.message)
            } finally {
                setIsLoadingList(false)
            }
        }

        fetchList()
    }, [])

    const header = <PageHeader title="Quizzes" icon={Compass} />

    return (
        <>
            {header}
            <div className="flex flex-1 flex-col p-4 pt-6">
                <div className="mx-auto w-full max-w-5xl">
                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold text-black">
                            Available Quizzes
                        </h2>
                        <p className="mt-1 text-sm text-black">
                            Select a quiz to test your abilities.
                        </p>
                    </div>

                    {isLoadingList ? (
                        <div className="py-20 text-center text-black">
                            Loading quizzes...
                        </div>
                    ) : listError ? (
                        <div className="py-20 text-center text-black">
                            Error: {listError}
                        </div>
                    ) : quizzesList.length === 0 ? (
                        <div className="py-20 text-center text-black">
                            No quizzes available
                        </div>
                    ) : (
                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            {quizzesList.map((q) => {
                                const diffClass =
                                    "bg-white text-black border-[#58CC02] hover:bg-[#58CC02]/5"

                                const questionCount = q.content?.questions?.length || 0
                                const questionsLabel = `${questionCount} Question${questionCount === 1 ? "" : "s"}`

                                return (
                                    <Card
                                        key={q.id}
                                        onClick={() => router.push(`/explore/quiz/${q.id}`)}
                                        className={[
                                            "flex cursor-pointer flex-col p-5",
                                            "bg-white text-black",
                                            "border-4 border-black",
                                            "shadow-[-12px_12px_0_0_rgba(22,163,74,0.55)]",
                                            "transition-all duration-200 ease-out",
                                            "hover:-translate-x-3 hover:translate-y-3",
                                            "hover:shadow-[-6px_6px_0_0_rgba(22,163,74,0.35)]",
                                            "active:translate-x-0 active:translate-y-0",
                                            "active:shadow-[-4px_4px_0_0_rgba(22,163,74,0.28)]",
                                        ].join(" ")}
                                    >
                                        <div className="mb-2 flex items-start justify-between gap-3">
                                            <h3 className="line-clamp-2 text-lg font-semibold leading-tight text-black">
                                                {q.title}
                                            </h3>
                                            <Badge
                                                variant="secondary"
                                                className={`shrink-0 border ${diffClass}`}
                                            >
                                                {q.difficulty}
                                            </Badge>
                                        </div>

                                        <p className="mb-6 flex-1 text-sm text-black">
                                            {q.description}
                                        </p>

                                        <div className="w-fit rounded-md border border-[#58CC02] bg-white px-2.5 py-1 text-xs font-semibold text-black">

                                        {questionsLabel}
                                        </div>
                                    </Card>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
