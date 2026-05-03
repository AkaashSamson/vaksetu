"use client"

import * as React from "react"
import { Trophy, Users, Loader2, Calendar, Clock } from "lucide-react"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { GroupLeaderboardPreview } from "@/lib/db/queries/leaderboard"
import { LeaderboardGroupCard } from "@/components/leaderboard/LeaderboardGroupCard"
import { Button } from "@/components/ui/button"

export default function LeaderboardPage() {
    const [groups, setGroups] = React.useState<GroupLeaderboardPreview[]>([])
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState<string | null>(null)
    const [timeframe, setTimeframe] = React.useState<'weekly' | 'all-time'>('weekly')

    React.useEffect(() => {
        async function fetchLeaderboards() {
            setLoading(true);
            try {
                const res = await fetch(`/api/leaderboard?timeframe=${timeframe}`);
                if (!res.ok) throw new Error('Failed to fetch leaderboard data');
                const data = await res.json();
                setGroups(data);
                setError(null);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchLeaderboards();
    }, [timeframe]);

    const header = (
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-green-100 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
            <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1 text-green-700" />
                <Separator orientation="vertical" className="mr-2 h-4 bg-green-200" />
                <Trophy className="size-5 text-green-600" />
                <h1 className="text-lg font-bold text-green-900 leading-none">Your Leaderboards</h1>
            </div>
        </header>
    )

    return (
        <div className="min-h-screen bg-[#fcfdfc]">
            {header}

            <div className="flex flex-1 flex-col p-6 pt-8">
                <div className="mx-auto w-full max-w-5xl">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                        <div>
                            <h2 className="text-3xl font-extrabold text-green-950 tracking-tight">Community Standings</h2>
                            <p className="text-green-700 mt-2 text-lg">Check out where you stand across your learning groups.</p>
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
                            <p className="font-medium text-lg">Loading leaderboards...</p>
                        </div>
                    ) : error ? (
                        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-800">
                            <h3 className="font-semibold text-lg mb-1">Error</h3>
                            <p>{error}</p>
                        </div>
                    ) : groups.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-2xl border border-green-100 shadow-sm">
                            <Users className="w-16 h-16 mx-auto text-green-200 mb-4" />
                            <h3 className="text-xl font-bold text-green-900 mb-2">No Groups Found</h3>
                            <p className="text-green-600">Join a learning group to see where you rank among your peers!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {groups.map(group => (
                                <LeaderboardGroupCard key={group.groupId} group={group} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}