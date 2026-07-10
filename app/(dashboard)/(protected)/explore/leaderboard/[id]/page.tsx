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
import { PageHeader } from "@/components/shared/PageHeader"

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

    return (
        <>
            <PageHeader 
                title="Group Rankings" 
                icon={Trophy} 
                rightContent={
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/explore/leaderboard">
                            <ChevronLeft className="mr-1 size-4" />
                            Back
                        </Link>
                    </Button>
                }
            />

            <div className="flex flex-1 flex-col p-4 pt-6">
                <div className="mx-auto w-full max-w-5xl">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
                        <div>
                            <h2 className="text-2xl font-semibold">Full Leaderboard</h2>
                            <p className="text-sm text-muted-foreground mt-1">See everyone's standings for this group.</p>
                        </div>
                        
                        <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-lg border self-start md:self-auto">
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
                        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                            <Loader2 className="w-10 h-10 animate-spin mb-4" />
                            <p className="font-medium text-lg">Loading rankings...</p>
                        </div>
                    ) : error ? (
                        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-800">
                            <h3 className="font-semibold text-lg mb-1">Error</h3>
                            <p>{error}</p>
                        </div>
                    ) : members.length === 0 ? (
                        <div className="text-center py-16 bg-background rounded-2xl border shadow-sm text-muted-foreground">
                            <Trophy className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <h3 className="text-xl font-bold text-foreground mb-2">No Scores Yet</h3>
                            <p className="text-sm">Be the first to complete a quiz and claim the top spot!</p>
                        </div>
                    ) : (
                        <div className="mt-4 border rounded-xl overflow-hidden bg-background">
                            {members.map((member, index) => (
                                <LeaderboardRankItem 
                                    key={member.userId} 
                                    item={member} 
                                    rank={index + 1} 
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
