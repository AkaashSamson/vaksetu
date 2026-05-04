"use client";

import React, { useEffect } from "react";

export function Modal(props: {
    open: boolean;
    title: string;
    description?: string;
    onClose: () => void;
    children: React.ReactNode;
}) {
    const { open, title, description, onClose, children } = props;

    useEffect(() => {
        if (!open) return;

        function onKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") onClose();
        }

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50">
            <button
                aria-label="Close modal"
                className="absolute inset-0 bg-black/40"
                onClick={onClose}
                type="button"
            />
            <div className="absolute left-1/2 top-1/2 w-[92vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border bg-background p-5 shadow-lg">
                <div className="mb-4 space-y-1">
                    <div className="flex items-start justify-between gap-3">
                        <h2 className="text-base font-semibold">{title}</h2>
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-md px-2 py-1 text-sm text-muted-foreground hover:bg-muted"
                        >
                            Close
                        </button>
                    </div>
                    {description ? (
                        <p className="text-sm text-muted-foreground">{description}</p>
                    ) : null}
                </div>

                {children}
            </div>
        </div>
    );
}