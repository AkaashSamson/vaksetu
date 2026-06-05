"use client";

import React, { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    // Form fields
    const [fullName, setFullName] = useState("");
    const [contactNo, setContactNo] = useState("");
    const [bioDescription, setBioDescription] = useState("");

    useEffect(() => {
        async function loadProfile() {
            try {
                const res = await fetch("/api/profile");
                if (!res.ok) {
                    throw new Error("Failed to load profile");
                }
                const data = await res.json();
                setProfile(data);
                setFullName(data.fullName || "");
                setContactNo(data.contactNo || "");
                setBioDescription(data.bioDescription || "");
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        loadProfile();
    }, []);

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        setError(null);
        setSuccessMsg(null);

        try {
            const res = await fetch("/api/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fullName,
                    contactNo,
                    bioDescription,
                }),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || "Failed to update profile");
            }

            const updated = await res.json();
            setProfile(updated);
            setSuccessMsg("Profile updated successfully!");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="flex flex-1 items-center justify-center p-6">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                <div className="flex w-full items-center gap-2 px-4">
                    <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
                    <User className="size-4 text-muted-foreground" />
                    <h1 className="text-lg font-semibold leading-none">Account Settings</h1>
                </div>
            </header>

            <div className="flex flex-1 flex-col p-4 pt-0">
                <div className="mx-auto w-full max-w-2xl space-y-6">
                    <Card className="border-border">
                        <CardHeader>
                            <CardTitle>Profile Details</CardTitle>
                            <CardDescription>
                                Manage your public profile and personal information.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-8 flex items-center gap-6">
                                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted border-2 border-border shadow-sm">
                                    {profile?.avatarUrl ? (
                                        <img 
                                            src={profile.avatarUrl} 
                                            alt="Profile" 
                                            className="h-full w-full rounded-full object-cover" 
                                        />
                                    ) : (
                                        <User className="h-12 w-12 text-muted-foreground" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium">{profile?.fullName || "User"}</h3>
                                    <p className="text-sm text-muted-foreground">{profile?.email}</p>
                                </div>
                            </div>

                            <form onSubmit={handleSave} className="space-y-4">
                                {error && (
                                    <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-600">
                                        {error}
                                    </div>
                                )}
                                {successMsg && (
                                    <div className="rounded-lg border border-brand-500/30 bg-brand-500/10 p-3 text-sm text-brand-600">
                                        {successMsg}
                                    </div>
                                )}

                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={profile?.email || ""}
                                        disabled
                                        className="bg-muted"
                                    />
                                    <p className="text-[0.8rem] text-muted-foreground">
                                        Your email address cannot be changed here.
                                    </p>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="username">Username / Full Name</Label>
                                    <Input
                                        id="username"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="Display name"
                                        required
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="contactNo">Contact Number</Label>
                                    <Input
                                        id="contactNo"
                                        value={contactNo}
                                        onChange={(e) => setContactNo(e.target.value)}
                                        placeholder="+1 234 567 8900"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="bio">Bio / Description</Label>
                                    <Textarea
                                        id="bio"
                                        value={bioDescription}
                                        onChange={(e) => setBioDescription(e.target.value)}
                                        placeholder="Tell us a little bit about yourself"
                                        rows={4}
                                        className="resize-none"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    variant="outline"
                                    disabled={saving}
                                    className={[
                                    "bg-white text-black",
                                    "border-4 border-black",
                                    "shadow-[-5px_5px_0_0_rgba(22,163,74,0.45)]",
                                    "transition-all duration-200 ease-out",
                                    "hover:-translate-x-1 hover:translate-y-1",
                                    "hover:shadow-[-3px_3px_0_0_rgba(22,163,74,0.35)]",
                                    "active:translate-x-0 active:translate-y-0",
                                    "active:shadow-[-2px_2px_0_0_rgba(22,163,74,0.28)]",
                                    "disabled:opacity-60 disabled:cursor-not-allowed",
                                ].join(" ")}
                                    >
                                    {saving ? "Saving changes..." : "Save Changes"}
                            </Button>

                        </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
