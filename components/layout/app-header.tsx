"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

export function AppHeader() {
    const router = useRouter()

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton size="lg" className="pointer-events-auto justify-center">
                    <div
                        className="flex aspect-square size-8 items-center justify-center rounded-lg overflow-hidden cursor-pointer"
                        onClick={() => router.push("/")}
                    >
                        <Image src="/hand.png" alt="Vaksetu" width={32} height={32} />
                    </div>
                    <span className="sr-only">Vaksetu</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}