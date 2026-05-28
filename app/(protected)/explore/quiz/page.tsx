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
    type: "image_mcq" | "sign_mcq"
}

export default function QuizPage() {
    const router = useRouter()

    // List View State
    const [quizzesList, setQuizzesList] = React.useState<BaseQuiz[]>([])
    const [isLoadingList, setIsLoadingList] = React.useState(true)
    const [listError, setListError] = React.useState<string | null>(null)

    // Fetch Quiz List on Mount
    React.useEffect(() => {
        async function fetchList() {
            try {
                setIsLoadingList(true)
                const res = await fetch(`/api/quizzes`)
                if (!res.ok) throw new Error("Failed to fetch quizzes")
                const data: BaseQuiz[] = await res.json()
                
                // Ensure data is sorted so the flow makes sense
                const sorted = data.sort((a,b) => a.title.localeCompare(b.title))
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

    const header = (
        <PageHeader 
            title="Quizzes" 
            icon={Compass} 
        />
    )

    return (
        <>
            {header}
            <div className="flex flex-1 flex-col p-4 pt-6">
                <div className="mx-auto w-full max-w-5xl">
                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold">Available Quizzes</h2>
                        <p className="text-sm text-muted-foreground mt-1">Select a quiz to test your abilities.</p>
                    </div>
                    
                    {isLoadingList ? (
                        <div className="py-20 text-center text-muted-foreground">Loading quizzes...</div>
                    ) : listError ? (
                        <div className="py-20 text-center text-red-500">Error: {listError}</div>
                    ) : quizzesList.length === 0 ? (
                        <div className="py-20 text-center text-muted-foreground">No quizzes available</div>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {quizzesList.map((q) => {
                                const diffLower = q.difficulty.toLowerCase()
                                const diffClass = 
                                    diffLower === 'easy' ? 'bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20' : 
                                    diffLower === 'medium' ? 'bg-amber-500/10 text-amber-700 hover:bg-amber-500/20' : 
                                    'bg-red-500/10 text-red-700 hover:bg-red-500/20'
                                
                                const typeName = q.type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')

                                return (
                                    <Card 
                                        key={q.id} 
                                        className="flex flex-col p-5 cursor-pointer transition-all hover:border-brand-500/40 hover:shadow-sm" 
                                        onClick={() => router.push(`/explore/quiz/${q.id}`)}
                                    >
                                        <div className="flex items-start justify-between gap-3 mb-2">
                                            <h3 className="font-semibold text-lg line-clamp-2 leading-tight">{q.title}</h3>
                                            <Badge variant="secondary" className={`shrink-0 ${diffClass}`}>
                                                {q.difficulty}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-6 flex-1">{q.description}</p>
                                        <div className="flex items-center text-xs font-medium text-muted-foreground bg-muted/60 w-fit px-2.5 py-1 rounded-md">
                                            {typeName}
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