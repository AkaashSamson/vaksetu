import React from "react"
import { LucideIcon } from "lucide-react"

interface PageHeaderProps {
    title: string
    icon: LucideIcon
    rightContent?: React.ReactNode
}

export function PageHeader({ title, icon: Icon, rightContent }: PageHeaderProps) {
    return (
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b">
            <div className="flex w-full items-center justify-between gap-2 px-4">
                <div className="flex items-center gap-2">
                    <Icon className="size-4 text-muted-foreground shrink-0" />
                    <h1 className="text-lg font-semibold leading-none">{title}</h1>
                </div>
                {rightContent && <div>{rightContent}</div>}
            </div>
        </header>
    )
}
