"use client"

import * as React from "react"
import Link from "next/link"
import { Briefcase, ArrowRight, Clock, CheckCircle2 } from "lucide-react"
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
 * ServiceCard - Card for displaying a contracted service (project)
 * For client view, "Project" is displayed as "Service"
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
                "block p-4 rounded-xl border bg-card",
                "transition-all duration-200",
                "hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5",
                "active:scale-[0.98]",
                "touch-target"
            )}
        >
            <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={cn(
                    "flex items-center justify-center w-12 h-12 rounded-lg shrink-0",
                    statusInfo.bgColor
                )}>
                    <Briefcase className={cn("h-6 w-6", statusInfo.color)} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-base truncate">{name}</h3>

                    <div className="flex items-center gap-2 mt-1">
                        <StatusIcon className={cn("h-4 w-4", statusInfo.color)} />
                        <span className={cn("text-sm", statusInfo.color)}>
                            {statusInfo.label}
                        </span>
                    </div>

                    {updateCount !== undefined && updateCount > 0 && (
                        <p className="text-xs text-muted-foreground mt-2">
                            {updateCount} {updateCount === 1 ? "atualização" : "atualizações"}
                        </p>
                    )}
                </div>

                {/* Arrow */}
                <ArrowRight className="h-5 w-5 text-muted-foreground shrink-0 self-center" />
            </div>
        </Link>
    )
}
