"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { format, isPast, isFuture, isToday, differenceInDays } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CheckCircle2, Clock, Calendar, ArrowRight } from "lucide-react"

export type TimelineMilestone = {
    id: string
    title: string
    date: Date | null
    status: "completed" | "current" | "upcoming"
    description?: string
}

interface OutcomeTimelineProps {
    milestones: TimelineMilestone[]
    className?: string
}

/**
 * OutcomeTimeline - Read-only timeline for client view
 * 
 * Shows milestones in a vertical timeline format:
 * - Completed: Green check
 * - Current: Blue dot (animated)
 * - Upcoming: Gray dot
 */
export function OutcomeTimeline({ milestones, className }: OutcomeTimelineProps) {
    return (
        <div className={cn("relative", className)}>
            {/* Vertical line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

            <div className="space-y-6">
                {milestones.map((milestone, index) => {
                    const isCompleted = milestone.status === "completed"
                    const isCurrent = milestone.status === "current"
                    const isUpcoming = milestone.status === "upcoming"

                    return (
                        <div key={milestone.id} className="relative pl-10">
                            {/* Status Icon */}
                            <div
                                className={cn(
                                    "absolute left-0 w-8 h-8 rounded-full flex items-center justify-center",
                                    isCompleted && "bg-emerald-100 text-emerald-600",
                                    isCurrent && "bg-blue-100 text-blue-600 ring-4 ring-blue-50",
                                    isUpcoming && "bg-muted text-muted-foreground"
                                )}
                            >
                                {isCompleted && <CheckCircle2 className="h-4 w-4" />}
                                {isCurrent && (
                                    <div className="relative">
                                        <Clock className="h-4 w-4" />
                                        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                                    </div>
                                )}
                                {isUpcoming && <Calendar className="h-4 w-4" />}
                            </div>

                            {/* Content */}
                            <div
                                className={cn(
                                    "p-4 rounded-lg border transition-colors",
                                    isCompleted && "bg-emerald-50/50 border-emerald-200",
                                    isCurrent && "bg-blue-50/50 border-blue-200 shadow-sm",
                                    isUpcoming && "bg-muted/30 border-muted"
                                )}
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <h4 className={cn(
                                            "font-semibold",
                                            isCompleted && "text-emerald-700",
                                            isCurrent && "text-blue-700",
                                            isUpcoming && "text-muted-foreground"
                                        )}>
                                            {milestone.title}
                                        </h4>
                                        {milestone.description && (
                                            <p className="text-sm text-muted-foreground mt-1">
                                                {milestone.description}
                                            </p>
                                        )}
                                    </div>
                                    {milestone.date && (
                                        <span className={cn(
                                            "text-xs shrink-0 px-2 py-1 rounded",
                                            isCompleted && "bg-emerald-100 text-emerald-700",
                                            isCurrent && "bg-blue-100 text-blue-700",
                                            isUpcoming && "bg-muted text-muted-foreground"
                                        )}>
                                            {format(milestone.date, "dd MMM", { locale: ptBR })}
                                        </span>
                                    )}
                                </div>

                                {/* Status badge */}
                                <div className="mt-2">
                                    <span className={cn(
                                        "inline-flex items-center gap-1 text-xs",
                                        isCompleted && "text-emerald-600",
                                        isCurrent && "text-blue-600",
                                        isUpcoming && "text-muted-foreground"
                                    )}>
                                        {isCompleted && (
                                            <>
                                                <CheckCircle2 className="h-3 w-3" />
                                                Concluído
                                            </>
                                        )}
                                        {isCurrent && (
                                            <>
                                                <Clock className="h-3 w-3" />
                                                Em Andamento
                                            </>
                                        )}
                                        {isUpcoming && (
                                            <>
                                                <ArrowRight className="h-3 w-3" />
                                                Em Breve
                                            </>
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Empty state */}
            {milestones.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Nenhuma etapa registrada ainda.</p>
                </div>
            )}
        </div>
    )
}

/**
 * Helper function to derive milestone status from task data
 */
export function deriveTimelineStatus(
    date: Date | null,
    isComplete: boolean
): "completed" | "current" | "upcoming" {
    if (isComplete) return "completed"
    if (!date) return "upcoming"
    if (isPast(date) && !isToday(date)) return "completed" // Overdue but we show as current
    if (isToday(date) || (isFuture(date) && differenceInDays(date, new Date()) <= 7)) {
        return "current"
    }
    return "upcoming"
}
