"use client"

import * as React from "react"
import { Trophy, Users, Loader2, Calendar, Clock, ChevronLeft, ChevronRight } from "lucide-react"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { GroupLeaderboardPreview } from "@/lib/db/queries/leaderboard"
import { LeaderboardGroupCard } from "@/components/leaderboard/LeaderboardGroupCard"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/shared/PageHeader"

export default function LeaderboardPage() {
    const [groups, setGroups] = React.useState<GroupLeaderboardPreview[]>([])
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState<string | null>(null)
    const [timeframe, setTimeframe] = React.useState<'weekly' | 'all-time'>('weekly')
    const [activeIndex, setActiveIndex] = React.useState(0)

    React.useEffect(() => {
        async function fetchLeaderboards() {
            setLoading(true);
            try {
                const res = await fetch(`/api/leaderboard?timeframe=${timeframe}`);
                if (!res.ok) throw new Error('Failed to fetch leaderboard data');
                const data = await res.json();
                setGroups(data);
                setError(null);
                setActiveIndex(0); // Reset index on data change
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchLeaderboards();
    }, [timeframe]);

    const handleNext = () => {
        if (activeIndex < groups.length - 1) {
            setActiveIndex(prev => prev + 1)
        }
    }

    const handlePrev = () => {
        if (activeIndex > 0) {
            setActiveIndex(prev => prev - 1)
        }
    }

    return (
        <>
            <PageHeader title="Your Leaderboards" icon={Trophy} />

            <div className="flex flex-1 flex-col p-4 pt-6">
                <div className="mx-auto w-full max-w-4xl">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                        <div>
                            <h2 className="text-2xl font-semibold">Community Standings</h2>
                            <p className="text-sm text-muted-foreground mt-1">Check out where you stand across your learning groups.</p>
                        </div>
                        
                        <div className="flex items-center gap-2 bg-green-50 p-1 rounded-lg border border-green-200 self-start md:self-auto">
                            <Button 
                                variant={timeframe === 'weekly' ? 'default' : 'ghost'} 
                                size="sm"
                                onClick={() => setTimeframe('weekly')}
                                className={timeframe === 'weekly' ? 'bg-green-900 hover:bg-green-800 text-white shadow-sm' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}
                            >
                                <Calendar className="w-4 h-4 mr-2" />
                                Weekly
                            </Button>
                            <Button 
                                variant={timeframe === 'all-time' ? 'default' : 'ghost'} 
                                size="sm"
                                onClick={() => setTimeframe('all-time')}
                                className={timeframe === 'all-time' ? 'bg-green-900 hover:bg-green-800 text-white shadow-sm' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}
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
                        <div className="flex items-center justify-center gap-6">
                            <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-12 w-12 shrink-0 rounded-full bg-white shadow-sm disabled:opacity-50"
                                onClick={handlePrev}
                                disabled={activeIndex === 0}
                            >
                                <ChevronLeft className="h-6 w-6" />
                            </Button>

                            <div className="flex-1 max-w-xl transition-all duration-300">
                                <LeaderboardGroupCard group={groups[activeIndex]} />
                                <div className="mt-4 text-center text-sm text-muted-foreground font-medium">
                                    {activeIndex + 1} of {groups.length}
                                </div>
                            </div>

                            <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-12 w-12 shrink-0 rounded-full bg-white shadow-sm disabled:opacity-50"
                                onClick={handleNext}
                                disabled={activeIndex === groups.length - 1}
                            >
                                <ChevronRight className="h-6 w-6" />
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}