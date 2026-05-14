"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Users } from "lucide-react";
import {
    joinGroup,
    leaveGroup,
} from "@/lib/communities/service";
import { LeaderboardRankItem } from "@/components/leaderboard/LeaderboardRankItem";
import { PopulatedCommunityGroup } from "@/lib/db/queries/communities";

function AddQuizDialog({
    open,
    onClose,
    groupId,
    groupQuizzes,
    onQuizAdded
}: {
    open: boolean;
    onClose: () => void;
    groupId: string;
    groupQuizzes: any[];
    onQuizAdded: () => void;
}) {
    const [systemQuizzes, setSystemQuizzes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState<string[]>([]);
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        if (!open) return;
        setLoading(true);
        fetch('/api/quizzes')
            .then(res => res.json())
            .then(data => {
                const available = data.filter((q: any) => !groupQuizzes.some(gq => gq.id === q.id));
                setSystemQuizzes(available);
                setLoading(false);
            });
    }, [open, groupQuizzes]);

    if (!open) return null;

    async function handleAdd() {
        if (selected.length === 0) return;
        setAdding(true);
        await fetch(`/api/communities/${groupId}/quizzes`, {
            method: 'POST',
            body: JSON.stringify({ quizIds: selected }),
            headers: { 'Content-Type': 'application/json' }
        });
        setAdding(false);
        onQuizAdded();
        onClose();
        setSelected([]);
    }

    return (
        <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <div className="absolute left-1/2 top-1/2 w-[92vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border bg-background p-5 shadow-lg max-h-[80vh] flex flex-col">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Add Quizzes to Group</h2>
                    <button onClick={onClose} className="text-muted-foreground hover:bg-muted px-2 py-1 rounded">Close</button>
                </div>
                <div className="flex-1 overflow-y-auto space-y-2">
                    {loading ? <p className="text-sm text-muted-foreground">Loading available quizzes...</p> : 
                        systemQuizzes.length === 0 ? <p className="text-sm text-muted-foreground">No new quizzes available to add.</p> :
                        systemQuizzes.map(q => (
                            <div 
                                key={q.id} 
                                className="flex items-center gap-3 p-3 border rounded-xl hover:bg-muted/50 cursor-pointer" 
                                onClick={() => setSelected(s => s.includes(q.id) ? s.filter(id => id !== q.id) : [...s, q.id])}
                            >
                                <input type="checkbox" checked={selected.includes(q.id)} readOnly className="size-4" />
                                <div>
                                    <div className="font-medium">{q.title}</div>
                                    <div className="text-xs text-muted-foreground line-clamp-1">{q.description || 'No description'}</div>
                                </div>
                            </div>
                        ))
                    }
                </div>
                <div className="mt-4 pt-4 border-t flex justify-end">
                    <button 
                        onClick={handleAdd} 
                        disabled={adding || selected.length === 0} 
                        className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-green-700 disabled:opacity-50"
                    >
                        {adding ? 'Adding...' : `Add ${selected.length} Quizzes`}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function GroupPage() {
    const router = useRouter();
    const params = useParams<{ groupId: string }>();
    const groupId = params.groupId;

    const [group, setGroup] = useState<PopulatedCommunityGroup | null>(null);
    const [currentUser, setCurrentUser] = useState<string | null>(null);
    const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [addQuizOpen, setAddQuizOpen] = useState(false);
    const [visibleRegularCount, setVisibleRegularCount] = useState(5);

    const loadGroup = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/communities/${groupId}`);
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Group not found");
            }
            const data = await res.json();
            setGroup(data.group);
            setCurrentUser(data.currentUser);
            setLeaderboardData(data.leaderboard || []);
            setError(null);
        } catch (e: any) {
            setError(e.message);
            setGroup(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (groupId) loadGroup();
    }, [groupId]);

    const isMember = !!group?.memberIds?.includes(currentUser || "");
    const isAdmin = !!group && !!currentUser && group.ownerId === currentUser;

    async function handleJoinLeave() {
        if (!group) return;
        setLoading(true);
        try {
            if (!currentUser) return;
            if (!isMember) {
                await joinGroup({ groupId: group.id, userId: currentUser });
            } else {
                await leaveGroup({ groupId: group.id, userId: currentUser });
            }
            await loadGroup();
        } finally {
            setLoading(false);
        }
    }

    async function toggleWeekly(quizId: string, currentStatus: boolean) {
        if (!group) return;
        setLoading(true);
        try {
            await fetch(`/api/communities/${group.id}/quizzes/${quizId}`, {
                method: 'PATCH',
                body: JSON.stringify({ activeThisWeek: !currentStatus }),
                headers: { 'Content-Type': 'application/json' }
            });
            await loadGroup();
        } finally {
            setLoading(false);
        }
    }

    if (loading && !group) {
        return (
            <div className="p-6 text-center">
                <p className="text-sm text-muted-foreground">Loading group…</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <p className="text-sm text-muted-foreground">{error}</p>
                <button
                    type="button"
                    className="mt-4 rounded-xl border px-4 py-2 text-sm hover:bg-muted"
                    onClick={() => router.push("/explore/communities")}
                >
                    Back to Communities
                </button>
            </div>
        );
    }

    if (!group) return null;

    const sortedLeaderboard = [...leaderboardData].sort((a, b) => b.score - a.score);
    const filteredLeaderboard = searchQuery
        ? sortedLeaderboard.filter((row) => row.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : sortedLeaderboard;

    const weeklyQuizzes = (group.quizzes || []).filter(q => q.activeThisWeek);
    const regularQuizzes = (group.quizzes || []).filter(q => !q.activeThisWeek);
    const visibleRegularQuizzes = regularQuizzes.slice(0, visibleRegularCount);
    const hasMoreRegular = regularQuizzes.length > visibleRegularCount;

    return (
        <>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                <div className="flex w-full items-center justify-between gap-2 px-4">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
                        <Users className="size-4 text-muted-foreground" />
                        <h1 className="text-lg font-semibold leading-none">{group.name}</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        {isAdmin && (
                            <span className="rounded-full border border-green-500/25 bg-green-500/10 px-2 py-1 text-xs text-green-700 dark:text-green-400">
                                Admin
                            </span>
                        )}
                        {!isAdmin && (
                            <button
                                type="button"
                                disabled={loading}
                                onClick={() => void handleJoinLeave()}
                                className={[
                                    "rounded-xl px-4 py-2 text-sm font-medium transition disabled:opacity-50",
                                    isMember
                                        ? "border border-border bg-background hover:bg-muted text-muted-foreground"
                                        : "bg-green-600 text-white hover:bg-green-700",
                                ].join(" ")}
                            >
                                {loading && !group ? "Please wait…" : isMember ? "Leave Group" : "Join Group"}
                            </button>
                        )}
                    </div>
                </div>
            </header>

            <div className="flex flex-1 flex-col p-4 pt-0">
                <div className="mx-auto w-full max-w-4xl space-y-6">
                    {/* Group info */}
                    <section className="rounded-2xl border bg-background p-5">
                        <div className="space-y-2">
                            <div className="text-sm text-muted-foreground">Group Code</div>
                            <div className="text-lg font-semibold tracking-wide">{group.inviteCode}</div>
                            <p className="text-sm text-muted-foreground">{group.description}</p>
                            <div className="text-xs text-muted-foreground">
                                Members: {group.memberIds?.length ?? 0}
                            </div>
                        </div>
                    </section>

                    {!isMember ? (
                        <section className="rounded-2xl border bg-background p-8 text-center flex flex-col items-center justify-center min-h-[200px]">
                            <h2 className="text-lg font-semibold">Join this community</h2>
                            <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                                Become a member to unlock exclusive quizzes and view the group leaderboard.
                            </p>
                            <button
                                type="button"
                                onClick={() => void handleJoinLeave()}
                                disabled={loading}
                                className="mt-6 rounded-xl bg-green-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-green-700 transition"
                            >
                                {loading ? "Joining..." : "Join Now"}
                            </button>
                        </section>
                    ) : (
                        <>
                            {/* Quizzes */}
                            <section className="rounded-2xl border bg-background p-5">
                                <div className="flex items-center justify-between gap-3 mb-4">
                                    <h2 className="text-sm font-semibold text-muted-foreground">Quizzes</h2>
                                    {isAdmin && (
                                        <button
                                            type="button"
                                            onClick={() => setAddQuizOpen(true)}
                                            className="rounded-xl border px-3 py-2 text-sm hover:bg-muted"
                                        >
                                            Add quizzes
                                        </button>
                                    )}
                                </div>

                                {(!group.quizzes || group.quizzes.length === 0) ? (
                                    <p className="text-sm text-muted-foreground">No quizzes added to this community yet.</p>
                                ) : (
                                    <div className="space-y-6">
                                        {weeklyQuizzes.length > 0 && (
                                            <div>
                                                <h3 className="text-xs font-semibold uppercase tracking-wider text-green-600 dark:text-green-400 mb-3">Weekly Challenge</h3>
                                                <div className="grid gap-3 sm:grid-cols-2">
                                                    {weeklyQuizzes.map((quiz) => (
                                                        <div key={quiz.id} className="relative rounded-xl border-2 border-green-500/20 bg-green-50/50 dark:bg-green-950/20 p-4 hover:bg-muted transition group/quiz">
                                                            <h4 className="font-medium">{quiz.title}</h4>
                                                            <p className="text-sm text-muted-foreground line-clamp-2">{quiz.description}</p>
                                                            {isAdmin && (
                                                                <div className="mt-3">
                                                                    <button 
                                                                        onClick={() => toggleWeekly(quiz.id, true)}
                                                                        disabled={loading}
                                                                        className="text-xs bg-background border px-2 py-1 rounded text-muted-foreground hover:text-foreground disabled:opacity-50"
                                                                    >
                                                                        Remove from Weekly
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        
                                        {regularQuizzes.length > 0 && (
                                            <div>
                                                {weeklyQuizzes.length > 0 && <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Other Quizzes</h3>}
                                                <div className="grid gap-3 sm:grid-cols-2">
                                                    {visibleRegularQuizzes.map((quiz) => (
                                                        <div key={quiz.id} className="relative rounded-xl border bg-background p-4 hover:bg-muted transition">
                                                            <h4 className="font-medium">{quiz.title}</h4>
                                                            <p className="text-sm text-muted-foreground line-clamp-2">{quiz.description}</p>
                                                            {isAdmin && (
                                                                <div className="mt-3">
                                                                    <button 
                                                                        onClick={() => toggleWeekly(quiz.id, false)}
                                                                        disabled={loading}
                                                                        className="text-xs bg-muted border px-2 py-1 rounded text-muted-foreground hover:text-foreground disabled:opacity-50"
                                                                    >
                                                                        Make Weekly
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                                {hasMoreRegular && (
                                                    <div className="mt-4 text-center">
                                                        <button 
                                                            onClick={() => setVisibleRegularCount(prev => prev + 5)}
                                                            className="text-sm font-medium text-primary hover:underline"
                                                        >
                                                            Show More
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </section>

                            {/* Leaderboard */}
                            <section className="rounded-2xl border bg-background p-5">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <h2 className="text-sm font-semibold text-muted-foreground">Leaderboard</h2>
                                    <input 
                                        type="text"
                                        placeholder="Search members..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="rounded-lg border bg-background px-3 py-1.5 text-sm outline-none focus:border-primary/60 w-full sm:w-auto"
                                    />
                                </div>
                                <div className="mt-4 border rounded-xl overflow-hidden bg-background">
                                    {filteredLeaderboard.length === 0 ? (
                                        <div className="p-4 text-center text-sm text-muted-foreground">
                                            No members found.
                                        </div>
                                    ) : (
                                        filteredLeaderboard.map((row, idx) => (
                                            <LeaderboardRankItem
                                                key={`${row.userId}-${idx}`}
                                                rank={idx + 1}
                                                item={{
                                                    userId: row.userId,
                                                    fullName: row.name,
                                                    totalScore: row.score,
                                                    quizCount: 0,
                                                }}
                                            />
                                        ))
                                    )}
                                </div>
                            </section>
                        </>
                    )}
                </div>
            </div>

            <AddQuizDialog
                open={addQuizOpen}
                onClose={() => setAddQuizOpen(false)}
                groupId={group.id}
                groupQuizzes={group.quizzes || []}
                onQuizAdded={loadGroup}
            />
        </>
    );
}