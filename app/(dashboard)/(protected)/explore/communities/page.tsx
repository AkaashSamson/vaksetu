"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { Users, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Modal } from "@/components/communities/Modal";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { PopulatedCommunityGroup } from "@/lib/db/queries/communities";

function isMember(group: PopulatedCommunityGroup, currentUserId: string | null) {
    if (!currentUserId) return false;
    return group.memberIds.includes(currentUserId);
}

function generateCode() {
    return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export default function CommunitiesPage() {
    const router = useRouter();

    const [groups, setGroups] = useState<PopulatedCommunityGroup[]>([]);
    const [currentUser, setCurrentUser] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchGroups() {
            try {
                const res = await fetch('/api/communities');
                if (res.ok) {
                    const data = await res.json();
                    setCurrentUser(data.currentUser);
                    setGroups(data.groups);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        fetchGroups();
    }, []);

    const yourGroups = useMemo(() => groups.filter((g) => isMember(g, currentUser)), [groups, currentUser]);
    const otherGroups = useMemo(() => groups.filter((g) => !isMember(g, currentUser) && g.isPublic), [groups, currentUser]);

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
    const [isPublic, setIsPublic] = useState(true);
    const [createLoading, setCreateLoading] = useState(false);

    async function handleJoinSubmit() {
        setJoinError(null);
        setJoinLoading(true);

        try {
            const res = await fetch('/api/communities/join', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: joinCode }),
            });
            
            const data = await res.json();
            
            if (!res.ok || !data.ok) {
                setJoinError(data.error || "Invalid Code");
                return;
            }

            router.push(`/explore/communities/${data.groupId}`);
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
            const res = await fetch('/api/communities', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: groupName,
                    description: groupDesc,
                    code: groupCode,
                    quizIds: [],
                    isPublic: isPublic,
                }),
            });

            if (res.ok) {
                const newGroup = await res.json();
                setGroups((prev) => [newGroup, ...prev]);

                setCreateOpen(false);
                setGroupName("");
                setGroupDesc("");
                setGroupCode(generateCode());
                setIsPublic(true);

                router.push(`/explore/communities/${newGroup.id}`);
            }
        } finally {
            setCreateLoading(false);
        }
    }

    return (
        <>
            <PageHeader title="Communities" icon={Users} />

            {/* flex column -> buttons can sit at bottom using mt-auto */}
            <div className="flex flex-1 flex-col p-4 pt-0">
                <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8">
                    {/* CONTENT */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 text-green-800">
                            <Loader2 className="w-10 h-10 animate-spin mb-4 text-green-600" />
                            <p className="font-medium text-lg">Loading communities...</p>
                        </div>
                    ) : (
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
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div className="text-base font-semibold break-all">{g.name}</div>
                                                        {!g.isPublic && <Badge variant="secondary" className="text-[10px] uppercase font-semibold tracking-wider shrink-0">Private</Badge>}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        Created by: {g.ownerName || "Unknown"}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        Code: {g.inviteCode}
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
                                                        Created by: {g.ownerName || "Unknown"}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        Code: {g.inviteCode}
                                                    </div>
                                                </div>
                                                <p className="mt-3 text-sm text-muted-foreground line-clamp-3">
                                                    {g.description}
                                                </p>
                                                <div className="mt-3 text-xs text-muted-foreground">
                                                    Members: {g.memberIds?.length || 0} • Quizzes: {g.quizIds?.length || 0}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </section>
                        </div>
                    )}

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

                        <Button
                            className="w-full sm:w-auto rounded-xl bg-green-900 px-4 py-2 text-sm font-medium text-white hover:bg-green-800 transition-colors shadow-sm"
                            onClick={() => {
                                setGroupCode(generateCode());
                                setCreateOpen(true);
                            }}
                        >
                            Create Group
                        </Button>
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

                    <label className="flex items-center gap-3 text-sm rounded-xl border p-3 cursor-pointer hover:bg-muted/50 transition">
                        <Checkbox 
                            checked={!isPublic}
                            onCheckedChange={(checked) => setIsPublic(!checked)}
                        />
                        <span className="font-medium">Make this group private (Hidden from others)</span>
                    </label>

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