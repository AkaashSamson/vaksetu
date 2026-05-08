"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Users } from "lucide-react";
import {
    // seedGroups, // Removed mock data
    type CommunityGroup,
    joinGroup,
    leaveGroup,
    addQuizzesToGroup,
} from "@/lib/communities/service";
import { quizCatalog } from "@/lib/quizzes/catalog";
import { Modal } from "@/components/communities/Modal";
import { LeaderboardRankItem } from "@/components/leaderboard/LeaderboardRankItem";
import { PopulatedCommunityGroup } from "@/lib/db/queries/communities";

const CURRENT_USER_ID = "me";

export default function GroupPage() {
    const router = useRouter();
    const params = useParams<{ groupId: string }>();
    const groupId = params.groupId;

    const [group, setGroup] = useState<PopulatedCommunityGroup | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadGroup = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/communities/${groupId}`);
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Group not found");
            }
            const data = await res.json();
            setGroup(data);
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

    const isMember = !!group?.memberIds.includes(CURRENT_USER_ID);
    const isAdmin = !!group && group.ownerId === CURRENT_USER_ID;

    const [addQuizOpen, setAddQuizOpen] = useState(false);
    const [pendingQuizIds, setPendingQuizIds] = useState<string[]>([]);

    async function handleJoinLeave() {
        if (!group) return;
        setLoading(true);
        try {
            if (!isMember) {
                await joinGroup({ groupId: group.id, userId: CURRENT_USER_ID });
            } else {
                await leaveGroup({ groupId: group.id, userId: CURRENT_USER_ID });
            }
            await loadGroup();
        } finally {
            setLoading(false);
        }
    }

    async function handleAddQuizzes() {
        if (!group) return;
        if (!isAdmin) return;
        setLoading(true);
        try {
            await addQuizzesToGroup({ groupId: group.id, quizIds: pendingQuizIds });
            await loadGroup();
            setAddQuizOpen(false);
            setPendingQuizIds([]);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
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

    const sortedLeaderboard = [...group.leaderboard].sort((a, b) => b.score - a.score);

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
                        <button
                            type="button"
                            disabled={loading}
                            onClick={() => void handleJoinLeave()}
                            className={[
                                "rounded-xl px-4 py-2 text-sm font-medium transition disabled:opacity-50",
                                isMember
                                    ? "border border-border bg-background hover:bg-muted"
                                    : "bg-green-600 text-white hover:bg-green-700",
                            ].join(" ")}
                        >
                            {loading ? "Please wait…" : isMember ? "Leave Group" : "Join Group"}
                        </button>
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

                    {/* Quizzes */}
                    <section className="rounded-2xl border bg-background p-5">
                        <div className="flex items-center justify-between gap-3">
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
                        <div className="mt-3 space-y-3">
                            {group.quizIds.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No quizzes added to this community yet.</p>
                            ) : (
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {group.quizIds.map((quizId) => {
                                        const quiz = quizCatalog.find((q) => q.id === quizId);
                                        if (!quiz) return null;
                                        return (
                                            <button
                                                key={quiz.id}
                                                className="rounded-xl border bg-background p-4 text-left hover:bg-muted"
                                            >
                                                <h3 className="font-medium">{quiz.title}</h3>
                                                <p className="text-sm text-muted-foreground">{quiz.description}</p>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Leaderboard */}
                    <section className="rounded-2xl border bg-background p-5">
                        <h2 className="text-sm font-semibold text-muted-foreground">Leaderboard</h2>
                        <div className="mt-3 border rounded-xl overflow-hidden bg-background">
                            {sortedLeaderboard.map((row, idx) => (
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
                            ))}
                        </div>
                    </section>
                </div>
            </div>

            <Modal
                open={addQuizOpen}
                onOpenChange={setAddQuizOpen}
                pendingQuizIds={pendingQuizIds}
                setPendingQuizIds={setPendingQuizIds}
                onConfirm={handleAddQuizzes}
                loading={loading}
            />
        </>
    );
}