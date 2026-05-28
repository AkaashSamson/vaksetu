"use client"

import * as React from "react"
import { createClient } from "@/lib/supabase/client"
import { LoginBlocker } from "@/components/auth/login-blocker"

export default function LoginPage() {
    const [checking, setChecking] = React.useState(true)
    const supabase = createClient()

    React.useEffect(() => {
        async function checkSession() {
            try {
                const { data: { user } } = await supabase.auth.getUser()
                if (user) {
                    window.location.href = "/explore"
                } else {
                    setChecking(false)
                }
            } catch (err) {
                console.error("Error checking session:", err)
                setChecking(false)
            }
        }
        checkSession()
    }, [supabase])

    if (checking) {
        return (
            <div className="relative flex min-h-screen w-full items-center justify-center bg-background">
                {/* Premium background grid styling */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(34,197,94,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(34,197,94,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-80" />
                <div className="text-muted-foreground animate-pulse text-sm font-medium">Checking session...</div>
            </div>
        )
    }

    return (
        <div className="relative flex min-h-screen w-full items-center justify-center bg-background">
            {/* Premium background grid styling */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(34,197,94,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(34,197,94,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-80" />
            
            <LoginBlocker onAuthed={() => {
                window.location.href = "/explore"
            }} />
        </div>
    )
}
