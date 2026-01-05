"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface DashboardGridProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode
}

/**
 * DashboardGrid - Responsive Bento Grid container
 * 
 * Layout:
 * - Mobile: 1 column
 * - Tablet (md): 2 columns
 * - Desktop (lg): 4 columns
 * 
 * Uses CSS Grid with auto-rows for dynamic height based on content.
 */
export function DashboardGrid({ children, className, ...props }: DashboardGridProps) {
    return (
        <div
            className={cn(
                "grid gap-4",
                "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
                "auto-rows-min",
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
}
