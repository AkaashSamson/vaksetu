"use client";

import React, { useMemo, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Users } from "lucide-react";
import { Modal } from "@/components/communities/Modal";
import {
    createGroup,
    joinWithCode,
    seedGroups,
    type CommunityGroup,
} from "@/lib/communities/service";
import { quizCatalog } from "@/lib/quizzes/catalog";
import { useRouter } from "next/navigation";

const CURRENT_USER_ID = "me";

function isMember(group: CommunityGroup) {
    return group.members.includes(CURRENT_USER_ID);
}

function generateCode() {
    return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export default function CommunitiesPage() {
    const router = useRouter();

    const [groups, setGroups] = useState<CommunityGroup[]>(seedGroups);

    const yourGroups = useMemo(() => groups.filter(isMember), [groups]);
    const otherGroups = useMemo(() => groups.filter((g) => !isMember(g)), [groups]);

    // Join with code modal
    const [joinOpen, setJoinOpen] = useState(false);
    const [joinCode, setJoinCode] = useState("");
    const [joinError, setJoinError] = useState<string | null>(null);
    const [joinLoading, setJoinLoading] = useState(false);

    // Create group modal
    const [createOpen, setCreateOpen] = useState(false);
    const [groupName, setGroupName] = useState("");
    const [groupDesc, setGroupDesc] = useState("");
    const [groupCode, setGroupCode] = useState(generateCode());
    const [selectedQuizIds, setSelectedQuizIds] = useState<string[]>([]);
    const [createLoading, setCreateLoading] = useState(false);

    async function handleJoinSubmit() {
        setJoinError(null);
        setJoinLoading(true);

        try {
            const res = await joinWithCode({ code: joinCode, groups });
            if (!res.ok) {
                setJoinError("Invalid Code");
                return;
            }

            router.push(`/explore/communities/${res.groupId}`);
            setJoinOpen(false);
            setJoinCode("");
        } finally {
            setJoinLoading(false);
        }
    }

    async function handleCreateSubmit() {
        if (!groupName.trim()) return;

        setCreateLoading(true);
        try {
            const res = await createGroup({
                name: groupName,
                description: groupDesc,
                code: groupCode,
                ownerId: CURRENT_USER_ID,
                quizIds: selectedQuizIds,
            });

            // Add created group locally
            setGroups((prev) => [res.group, ...prev]);

            // Close modal + reset
            setCreateOpen(false);
            setGroupName("");
            setGroupDesc("");
            setGroupCode(generateCode());
            setSelectedQuizIds([]);

            router.push(`/explore/communities/${res.group.id}`);
        } finally {
            setCreateLoading(false);
        }
    }

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
                        <h1 className="text-lg font-semibold leading-none">Communities</h1>
                    </div>
                </div>
            </header>

            {/* flex column -> buttons can sit at bottom using mt-auto */}
            <div className="flex flex-1 flex-col p-4 pt-0">
                <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8">
                    {/* CONTENT */}
                    <div className="space-y-8">
                        {/* Your Communities */}
                        <section className="space-y-3">
                            <h2 className="text-sm font-semibold text-muted-foreground">
                                Your Communities
                            </h2>

                            {yourGroups.length === 0 ? (
                                <div className="rounded-2xl border border-dashed bg-background p-6 text-sm text-muted-foreground">
                                    You haven’t joined any communities yet. Join with a code or
                                    create your own.
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {yourGroups.map((g) => (
                                        <button
                                            key={g.id}
                                            type="button"
                                            onClick={() => router.push(`/explore/communities/${g.id}`)}
                                            className="text-left rounded-2xl border bg-background p-4 shadow-sm transition hover:shadow-md hover:border-green-500"
                                        >
                                            <div className="space-y-1">
                                                <div className="text-base font-semibold">{g.name}</div>
                                                <div className="text-xs text-muted-foreground">
                                                    Code: {g.code}
                                                </div>
                                            </div>
                                            <p className="mt-3 text-sm text-muted-foreground line-clamp-3">
                                                {g.description}
                                            </p>
                                            <div className="mt-3 text-xs text-muted-foreground">
                                                Quizzes: {g.quizIds.length}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* Other Communities */}
                        <section className="space-y-3">
                            <h2 className="text-sm font-semibold text-muted-foreground">
                                Other Communities
                            </h2>

                            {otherGroups.length === 0 ? (
                                <div className="rounded-2xl border bg-background p-6 text-sm text-muted-foreground">
                                    No other communities available right now.
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {otherGroups.map((g) => (
                                        <button
                                            key={g.id}
                                            type="button"
                                            onClick={() => router.push(`/explore/communities/${g.id}`)}
                                            className="text-left rounded-2xl border bg-background p-4 shadow-sm transition hover:shadow-md"
                                        >
                                            <div className="space-y-1">
                                                <div className="text-base font-semibold">{g.name}</div>
                                                <div className="text-xs text-muted-foreground">
                                                    Code: {g.code}
                                                </div>
                                            </div>
                                            <p className="mt-3 text-sm text-muted-foreground line-clamp-3">
                                                {g.description}
                                            </p>
                                            <div className="mt-3 text-xs text-muted-foreground">
                                                Members: {g.members.length} • Quizzes: {g.quizIds.length}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>

                    {/* BOTTOM BUTTONS */}
                    <div className="mt-auto flex flex-col gap-3 sm:flex-row sm:justify-end pb-2">
                        <button
                            type="button"
                            onClick={() => {
                                setJoinError(null);
                                setJoinCode("");
                                setJoinOpen(true);
                            }}
                            className="w-full sm:w-auto rounded-xl border border-border bg-background px-4 py-2 text-sm hover:bg-muted"
                        >
                            Join with Code
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setGroupCode(generateCode());
                                setSelectedQuizIds([]);
                                setCreateOpen(true);
                            }}
                            className="w-full sm:w-auto rounded-xl bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                        >
                            Create Group
                        </button>
                    </div>
                </div>
            </div>

            {/* Join modal */}
            <Modal
                open={joinOpen}
                title="Join with Code"
                description="Enter a group code to join a community."
                onClose={() => setJoinOpen(false)}
            >
                <div className="space-y-3">
                    <input
                        value={joinCode}
                        onChange={(e) => setJoinCode(e.target.value)}
                        placeholder="e.g. VAK123"
                        className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:border-primary/60"
                        onKeyDown={(e) => {
                            if (e.key === "Enter") void handleJoinSubmit();
                        }}
                    />

                    {joinError ? <p className="text-sm text-red-600">{joinError}</p> : null}

                    <button
                        type="button"
                        disabled={joinLoading || !joinCode.trim()}
                        onClick={() => void handleJoinSubmit()}
                        className="w-full rounded-xl bg-foreground px-4 py-3 text-sm font-medium text-background disabled:opacity-50"
                    >
                        {joinLoading ? "Checking…" : "Join"}
                    </button>
                </div>
            </Modal>

            {/* Create modal */}
            <Modal
                open={createOpen}
                title="Create Group"
                description="Create a new community and link quizzes to it."
                onClose={() => setCreateOpen(false)}
            >
                <div className="space-y-3">
                    <input
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        placeholder="Group name"
                        className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:border-primary/60"
                    />

                    <textarea
                        value={groupDesc}
                        onChange={(e) => setGroupDesc(e.target.value)}
                        placeholder="Description"
                        className="min-h-24 w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:border-primary/60"
                    />

                    <div className="flex items-center gap-2">
                        <input
                            value={groupCode}
                            onChange={(e) => setGroupCode(e.target.value.toUpperCase())}
                            placeholder="Group code"
                            className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:border-primary/60"
                        />
                        <button
                            type="button"
                            onClick={() => setGroupCode(generateCode())}
                            className="shrink-0 rounded-xl border px-3 py-3 text-sm hover:bg-muted"
                        >
                            Generate
                        </button>
                    </div>

                    {/* Quiz selection */}
                    <div className="space-y-2">
                        <div className="text-sm font-medium">Quizzes for this community</div>
                        <div className="rounded-xl border p-3 space-y-2">
                            {quizCatalog.map((q) => {
                                const checked = selectedQuizIds.includes(q.id);
                                return (
                                    <label key={q.id} className="flex items-start gap-3 text-sm">
                                        <input
                                            type="checkbox"
                                            checked={checked}
                                            onChange={(e) => {
                                                setSelectedQuizIds((prev) =>
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
                                            <span className="block text-xs text-muted-foreground">
                        {q.description}
                      </span>
                    </span>
                                    </label>
                                );
                            })}
                            {quizCatalog.length === 0 ? (
                                <p className="text-xs text-muted-foreground">No quizzes available.</p>
                            ) : null}
                        </div>
                    </div>

                    <button
                        type="button"
                        disabled={createLoading || !groupName.trim() || !groupCode.trim()}
                        onClick={() => void handleCreateSubmit()}
                        className="w-full rounded-xl bg-green-600 px-4 py-3 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                    >
                        {createLoading ? "Creating…" : "Create Group"}
                    </button>
                </div>
            </Modal>
        </>
    );
}