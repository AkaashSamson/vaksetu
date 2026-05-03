"use client"

import * as React from "react"
import { Trophy, ChevronLeft, Loader2, Calendar, Clock } from "lucide-react"
import { useParams } from "next/navigation"
import Link from "next/link"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { LeaderboardRankItem as ILeaderboardRankItem } from "@/lib/db/queries/leaderboard"
import { LeaderboardRankItem } from "@/components/leaderboard/LeaderboardRankItem"
import { Button } from "@/components/ui/button"

export default function GroupLeaderboardPage() {
    const params = useParams()
    const groupId = params?.id as string

    const [members, setMembers] = React.useState<ILeaderboardRankItem[]>([])
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState<string | null>(null)
    const [timeframe, setTimeframe] = React.useState<'weekly' | 'all-time'>('weekly')

    React.useEffect(() => {
        if (!groupId) return;

        async function fetchGroupLeaderboard() {
            setLoading(true);
            try {
                const res = await fetch(`/api/leaderboard/${groupId}?timeframe=${timeframe}`);
                if (!res.ok) throw new Error('Failed to fetch detailed leaderboard data');
                const data = await res.json();
                setMembers(data);
                setError(null);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchGroupLeaderboard();
    }, [groupId, timeframe]);

    const header = (
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-green-100 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
            <div className="flex items-center gap-2 px-4 w-full">
                <SidebarTrigger className="-ml-1 text-green-700" />
                <Separator orientation="vertical" className="mr-2 h-4 bg-green-200" />
                
                <Link href="/explore/leaderboard" className="flex items-center text-green-700 hover:text-green-900 transition-colors mr-2">
                    <ChevronLeft className="size-5" />
                    <span className="sr-only">Back</span>
                </Link>
                
                <Trophy className="size-5 text-green-600 mr-2" />
                <h1 className="text-lg font-bold text-green-900 leading-none truncate">Group Rankings</h1>
            </div>
        </header>
    )

    return (
        <div className="min-h-screen bg-[#fcfdfc]">
            {header}

            <div className="flex flex-1 flex-col p-4 md:p-8">
                <div className="mx-auto w-full max-w-4xl">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 bg-white p-6 rounded-2xl shadow-sm border border-green-100">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-green-950 tracking-tight">Full Leaderboard</h2>
                            <p className="text-green-700 mt-2">See everyone's standings for this group.</p>
                        </div>
                        
                        <div className="flex items-center gap-2 bg-green-50 p-1 rounded-lg border border-green-200 self-start md:self-auto">
                            <Button 
                                variant={timeframe === 'weekly' ? 'default' : 'ghost'} 
                                size="sm"
                                onClick={() => setTimeframe('weekly')}
                                className={timeframe === 'weekly' ? 'bg-green-600 hover:bg-green-700 text-white shadow-sm' : 'text-green-700 hover:bg-green-100 hover:text-green-900'}
                            >
                                <Calendar className="w-4 h-4 mr-2" />
                                Weekly
                            </Button>
                            <Button 
                                variant={timeframe === 'all-time' ? 'default' : 'ghost'} 
                                size="sm"
                                onClick={() => setTimeframe('all-time')}
                                className={timeframe === 'all-time' ? 'bg-green-600 hover:bg-green-700 text-white shadow-sm' : 'text-green-700 hover:bg-green-100 hover:text-green-900'}
                            >
                                <Clock className="w-4 h-4 mr-2" />
                                All-Time
                            </Button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 text-green-700">
                            <Loader2 className="w-10 h-10 animate-spin mb-4 text-green-600" />
                            <p className="font-medium text-lg">Loading rankings...</p>
                        </div>
                    ) : error ? (
                        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-800">
                            <h3 className="font-semibold text-lg mb-1">Error</h3>
                            <p>{error}</p>
                        </div>
                    ) : members.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-2xl border border-green-100 shadow-sm">
                            <Trophy className="w-16 h-16 mx-auto text-green-200 mb-4" />
                            <h3 className="text-xl font-bold text-green-900 mb-2">No Scores Yet</h3>
                            <p className="text-green-600">Be the first to complete a quiz and claim the top spot!</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl shadow-sm border border-green-100 overflow-hidden">
                            <div className="grid grid-cols-[auto_1fr_auto] gap-4 px-6 py-4 bg-green-50/50 border-b border-green-100 text-sm font-semibold text-green-800">
                                <div className="w-8 text-center">Rank</div>
                                <div>Member</div>
                                <div className="text-right">Score</div>
                            </div>
                            <div className="divide-y divide-green-50">
                                {members.map((member, index) => (
                                    <LeaderboardRankItem 
                                        key={member.userId} 
                                        item={member} 
                                        rank={index + 1} 
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
