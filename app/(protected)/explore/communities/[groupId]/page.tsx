"use client";

import React, { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Users } from "lucide-react";
import {
    seedGroups,
    type CommunityGroup,
    joinGroup,
    leaveGroup,
    addQuizzesToGroup,
} from "@/lib/communities/service";
import { quizCatalog } from "@/lib/quizzes/catalog";
import { Modal } from "@/components/communities/Modal";

const CURRENT_USER_ID = "me";

export default function GroupPage() {
    const router = useRouter();
    const params = useParams<{ groupId: string }>();
    const groupId = params.groupId;

    // Frontend-only: local state for this page
    const [groups, setGroups] = useState<CommunityGroup[]>(seedGroups);

    const group = useMemo(
        () => groups.find((g) => g.id === groupId) ?? null,
        [groups, groupId]
    );

    const isMember = !!group?.members.includes(CURRENT_USER_ID);
    const isAdmin = !!group && group.ownerId === CURRENT_USER_ID;

    const [loading, setLoading] = useState(false);

    // Add quizzes modal
    const [addQuizOpen, setAddQuizOpen] = useState(false);
    const [pendingQuizIds, setPendingQuizIds] = useState<string[]>([]);

    async function handleJoinLeave() {
        if (!group) return;
        setLoading(true);

        try {
            if (!isMember) {
                await joinGroup({ groupId: group.id, userId: CURRENT_USER_ID });

                setGroups((prev) =>
                    prev.map((g) =>
                        g.id === group.id
                            ? {
                                ...g,
                                members: Array.from(new Set([...g.members, CURRENT_USER_ID])),
                            }
                            : g
                    )
                );
            } else {
                await leaveGroup({ groupId: group.id, userId: CURRENT_USER_ID });

                setGroups((prev) =>
                    prev.map((g) =>
                        g.id === group.id
                            ? { ...g, members: g.members.filter((m) => m !== CURRENT_USER_ID) }
                            : g
                    )
                );
            }
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

            setGroups((prev) =>
                prev.map((g) =>
                    g.id === group.id
                        ? {
                            ...g,
                            quizIds: Array.from(new Set([...g.quizIds, ...pendingQuizIds])),
                        }
                        : g
                )
            );

            setAddQuizOpen(false);
            setPendingQuizIds([]);
        } finally {
            setLoading(false);
        }
    }

    if (!group) {
        return (
            <div className="p-6">
                <p className="text-sm text-muted-foreground">Group not found.</p>
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

    const sortedLeaderboard = [...group.leaderboard].sort((a, b) => b.score - a.score);

    return (
        <>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                <div className="flex w-full items-center justify-between gap-2 px-4">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                            orientation="vertical"
                            className="mr-2 data-[orientation=vertical]:h-4"
                        />
                        <Users className="size-4 text-muted-foreground" />
                        <h1 className="text-lg font-semibold leading-none">{group.name}</h1>
                    </div>

                    <div className="flex items-center gap-2">
                        {isAdmin ? (
                            <span className="rounded-full border border-green-500/25 bg-green-500/10 px-2 py-1 text-xs text-green-700 dark:text-green-400">
                Admin
              </span>
                        ) : null}

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
                            <div className="text-lg font-semibold tracking-wide">{group.code}</div>
                            <p className="text-sm text-muted-foreground">{group.description}</p>
                            <div className="text-xs text-muted-foreground">
                                Members: {group.members.length}
                            </div>
                        </div>
                    </section>

                    {/* Quizzes */}
                    <section className="rounded-2xl border bg-background p-5">
                        <div className="flex items-center justify-between gap-3">
                            <h2 className="text-sm font-semibold text-muted-foreground">Quizzes</h2>

                            {isAdmin ? (
                                <button
                                    type="button"
                                    onClick={() => setAddQuizOpen(true)}
                                    className="rounded-xl border px-3 py-2 text-sm hover:bg-muted"
                                >
                                    Add quizzes
                                </button>
                            ) : null}
                        </div>

                        <div className="mt-3 space-y-3">
                            {group.quizIds.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    No quizzes added to this community yet.
                                </p>
                            ) : (
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {group.quizIds.map((quizId) => {
                                        const quiz = quizCatalog.find((q) => q.id === quizId);
                                        if (!quiz) return null;

                                        return (
                                            <button
                                                key={quiz.id}
                                                type="button"
                                                // Adjust this URL to match your actual quiz routing
                                                onClick={() => router.push(`/explore/quiz?quizId=${quiz.id}`)}
                                                className="rounded-xl border p-4 text-left hover:shadow-sm"
                                            >
                                                <div className="font-medium">{quiz.title}</div>
                                                <p className="text-sm text-muted-foreground">{quiz.description}</p>
                                                {quiz.difficulty ? (
                                                    <p className="mt-2 text-xs text-muted-foreground">
                                                        Difficulty: {quiz.difficulty}
                                                    </p>
                                                ) : null}
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

                        <div className="mt-3 overflow-hidden rounded-xl border">
                            <div className="grid grid-cols-3 bg-muted/40 px-4 py-2 text-xs text-muted-foreground">
                                <div>Rank</div>
                                <div>Member</div>
                                <div className="text-right">Score</div>
                            </div>

                            {sortedLeaderboard.map((row, idx) => (
                                <div
                                    key={`${row.userId}-${idx}`}
                                    className="grid grid-cols-3 border-t px-4 py-3 text-sm"
                                >
                                    <div>{idx + 1}</div>
                                    <div className="truncate">{row.name}</div>
                                    <div className="text-right">{row.score}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>

            {/* Admin: add quizzes modal */}
            <Modal
                open={addQuizOpen}
                title="Add quizzes"
                description="Select quizzes to link to this community."
                onClose={() => {
                    setAddQuizOpen(false);
                    setPendingQuizIds([]);
                }}
            >
                <div className="space-y-3">
                    <div className="rounded-xl border p-3 space-y-2">
                        {quizCatalog.map((q) => {
                            const alreadyAdded = group.quizIds.includes(q.id);
                            const checked = alreadyAdded || pendingQuizIds.includes(q.id);

                            return (
                                <label key={q.id} className="flex items-start gap-3 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={checked}
                                        disabled={alreadyAdded}
                                        onChange={(e) => {
                                            setPendingQuizIds((prev) =>
                                                e.target.checked
                                                    ? Array.from(new Set([...prev, q.id]))
                                                    : prev.filter((id) => id !== q.id)
                                            );
                                        }}
                                        className="mt-1"
                                    />
                                    <span className="min-w-0">
                    <span className="font-medium">{q.title}</span>
                                        {q.difficulty ? (
                                            <span className="ml-2 text-xs text-muted-foreground">
                        ({q.difficulty})
                      </span>
                                        ) : null}
                                        {alreadyAdded ? (
                                            <span className="ml-2 text-xs text-muted-foreground">
                        (already added)
                      </span>
                                        ) : null}
                                        <span className="block text-xs text-muted-foreground">{q.description}</span>
                  </span>
                                </label>
                            );
                        })}
                    </div>

                    <button
                        type="button"
                        onClick={() => void handleAddQuizzes()}
                        disabled={loading || pendingQuizIds.length === 0}
                        className="w-full rounded-xl bg-green-600 px-4 py-3 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                    >
                        Add selected quizzes
                    </button>
                </div>
            </Modal>
        </>
    );
}