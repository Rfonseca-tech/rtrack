"use client"

import * as React from "react"
import Link from "next/link"
import { Briefcase, ChevronRight, Clock, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ServiceCardProps {
    id: string
    name: string
    status: "ACTIVE" | "COMPLETED" | "PAUSED"
    lastUpdate?: Date
    updateCount?: number
}

const statusConfig = {
    ACTIVE: {
        label: "Em andamento",
        icon: Clock,
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
    },
    COMPLETED: {
        label: "Concluído",
        icon: CheckCircle2,
        color: "text-emerald-500",
        bgColor: "bg-emerald-500/10",
    },
    PAUSED: {
        label: "Pausado",
        icon: Clock,
        color: "text-amber-500",
        bgColor: "bg-amber-500/10",
    },
}

/**
 * ServiceCard - Mobile-first card for displaying a contracted service
 * 
 * Features:
 * - Large touch target (min 64px height)
 * - Visual feedback on touch
 * - Clear status indicator
 */
export function ServiceCard({
    id,
    name,
    status,
    lastUpdate,
    updateCount,
}: ServiceCardProps) {
    const statusInfo = statusConfig[status]
    const StatusIcon = statusInfo.icon

    return (
        <Link
            href={`/client/services/${id}`}
            className={cn(
                // Base styles
                "block p-5 rounded-2xl border-2 bg-card",
                // Mobile-first: large touch target
                "min-h-[80px]",
                // Touch feedback
                "transition-all duration-150",
                "active:scale-[0.98] active:bg-muted/50",
                // Visual effects
                "hover:border-primary/40 hover:shadow-md"
            )}
        >
            <div className="flex items-center gap-4">
                {/* Icon - Large and prominent */}
                <div className={cn(
                    "flex items-center justify-center w-14 h-14 rounded-xl shrink-0",
                    statusInfo.bgColor
                )}>
                    <Briefcase className={cn("h-7 w-7", statusInfo.color)} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    {/* Service name - Large text */}
                    <h3 className="font-semibold text-base leading-tight truncate">
                        {name}
                    </h3>

                    {/* Status */}
                    <div className="flex items-center gap-2 mt-1.5">
                        <StatusIcon className={cn("h-4 w-4", statusInfo.color)} />
                        <span className={cn("text-sm font-medium", statusInfo.color)}>
                            {statusInfo.label}
                        </span>
                    </div>

                    {/* Update count */}
                    {updateCount !== undefined && updateCount > 0 && (
                        <p className="text-sm text-muted-foreground mt-1">
                            {updateCount} {updateCount === 1 ? "atualização" : "atualizações"}
                        </p>
                    )}
                </div>

                {/* Arrow - Large for visibility */}
                <ChevronRight className="h-6 w-6 text-muted-foreground shrink-0" />
            </div>
        </Link>
    )
}
