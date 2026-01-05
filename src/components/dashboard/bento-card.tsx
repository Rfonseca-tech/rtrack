"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface BentoCardProps extends React.HTMLAttributes<HTMLDivElement> {
    /** 
     * Size variant for grid span
     * - "default": 1x1 (single cell)
     * - "wide": 2x1 (spans 2 columns)
     * - "tall": 1x2 (spans 2 rows)
     * - "large": 2x2 (spans 2 columns and 2 rows)
     */
    size?: "default" | "wide" | "tall" | "large"
    /** Optional title displayed at top of card */
    title?: string
    /** Optional icon to display next to title */
    icon?: React.ReactNode
    children: React.ReactNode
}

const sizeClasses = {
    default: "",
    wide: "md:col-span-2",
    tall: "row-span-2",
    large: "md:col-span-2 row-span-2",
}

/**
 * BentoCard - Individual card/widget in the Bento Grid
 * 
 * Features:
 * - Glassmorphism effect (subtle backdrop blur)
 * - Square corners (max 4px radius per design spec)
 * - Hover elevation effect
 * - Configurable sizes for different grid spans
 */
export function BentoCard({
    size = "default",
    title,
    icon,
    children,
    className,
    ...props
}: BentoCardProps) {
    return (
        <div
            className={cn(
                // Base styling
                "relative overflow-hidden",
                "rounded border bg-card p-4",
                // Glassmorphism effect
                "backdrop-blur-sm bg-card/95",
                // Hover effect
                "transition-all duration-200",
                "hover:shadow-lg hover:-translate-y-0.5",
                // Size variant
                sizeClasses[size],
                className
            )}
            {...props}
        >
            {/* Card Header */}
            {(title || icon) && (
                <div className="flex items-center gap-2 mb-3">
                    {icon && (
                        <div className="text-muted-foreground">
                            {icon}
                        </div>
                    )}
                    {title && (
                        <h3 className="font-semibold text-sm tracking-tight">
                            {title}
                        </h3>
                    )}
                </div>
            )}

            {/* Card Content */}
            <div className="relative">
                {children}
            </div>
        </div>
    )
}
