"use client";

import React, { useRef, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export type DictionaryEntry = {
    id: string;
    query: string;
    translation: string;
    tags?: string[];
    signImageUrl?: string;
    signVideoUrl?: string;
};

type DictionaryCardProps = {
    entry: DictionaryEntry;
    onTagClick?: (tag: string) => void;
};

export function DictionaryCard({
                                   entry,
                               }: DictionaryCardProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [open, setOpen] = useState(false);

    const handleMouseEnter = async () => {
        if (!videoRef.current) return;

        try {
            videoRef.current.currentTime = 0;
            await videoRef.current.play();
        } catch {}
    };

    const handleMouseLeave = () => {
        if (!videoRef.current) return;

        videoRef.current.pause();
        videoRef.current.currentTime = 0;
    };

    return (
        <>
            <article
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={() => setOpen(true)}
                className="
                    group
                    relative
                    h-72
                    overflow-hidden
                    rounded-3xl
                    border
                    border-border
                    cursor-pointer
                    bg-black
                    shadow-sm
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:shadow-xl
                "
            >
                {/* Media */}
                <div className="absolute inset-0">
                    {entry.signVideoUrl ? (
                        <video
                            ref={videoRef}
                            src={entry.signVideoUrl}
                            muted
                            playsInline
                            preload="metadata"
                            className="
                                h-full
                                w-full
                                object-cover
                                transition-transform
                                duration-500
                                group-hover:scale-105
                            "
                        />
                    ) : entry.signImageUrl ? (
                        <img
                            src={entry.signImageUrl}
                            alt={entry.translation}
                            className="
                                h-full
                                w-full
                                object-cover
                                transition-transform
                                duration-500
                                group-hover:scale-105
                            "
                        />
                    ) : (
                        <div className="grid h-full place-items-center bg-muted text-muted-foreground">
                            No media
                        </div>
                    )}
                </div>

                {/* Gradient Overlay */}
                <div
                    className="
                        absolute
                        inset-0
                        bg-gradient-to-t
                        from-black/80
                        via-black/20
                        to-transparent
                    "
                />

                {/* Translation */}
                <div
                    className="
                        absolute
                        bottom-0
                        left-0
                        right-0
                        p-5
                        transition-opacity
                        duration-300
                        group-hover:opacity-0
                    "
                >
                    <h3 className="text-xl font-bold text-white">
                        {entry.translation}
                    </h3>

                    <p className="text-sm text-white/70">
                        {entry.query}
                    </p>
                </div>
            </article>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>
                            {entry.translation}
                        </DialogTitle>
                    </DialogHeader>

                    {entry.signVideoUrl ? (
                        <video
                            src={entry.signVideoUrl}
                            controls
                            autoPlay
                            className="
                                w-full
                                rounded-xl
                            "
                        />
                    ) : entry.signImageUrl ? (
                        <img
                            src={entry.signImageUrl}
                            alt={entry.translation}
                            className="
                                w-full
                                rounded-xl
                            "
                        />
                    ) : null}

                    {entry.tags?.length ? (
                        <div className="flex flex-wrap gap-2">
                            {entry.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="
                                        rounded-full
                                        border
                                        px-3
                                        py-1
                                        text-xs
                                    "
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    ) : null}
                </DialogContent>
            </Dialog>
        </>
    );
}