"use client"

import * as React from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CheckCircle2, Clock, Circle, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

export type MobileTimelineItem = {
    id: string
    title: string
    description?: string
    date?: Date | null
    status: "PENDING" | "IN_PROGRESS" | "WAITING_VALIDATION" | "COMPLETED"
    progress?: number
}

interface MobileTimelineProps {
    items: MobileTimelineItem[]
    className?: string
}

const statusConfig = {
    COMPLETED: {
        icon: CheckCircle2,
        color: "text-emerald-500",
        bgColor: "bg-emerald-500",
        label: "Concluído",
    },
    IN_PROGRESS: {
        icon: Clock,
        color: "text-blue-500",
        bgColor: "bg-blue-500",
        label: "Em Progresso",
    },
    WAITING_VALIDATION: {
        icon: Clock,
        color: "text-purple-500",
        bgColor: "bg-purple-500",
        label: "Validação",
    },
    PENDING: {
        icon: Circle,
        color: "text-muted-foreground",
        bgColor: "bg-muted",
        label: "Pendente",
    },
}

/**
 * MobileTimeline - Vertical timeline optimized for mobile devices
 * 
 * Features:
 * - Vertical layout for easy scrolling
 * - Large touch targets (44px minimum)
 * - Status-colored timeline dots
 * - Connecting line between items
 * - Progress indicators
 */
export function MobileTimeline({ items, className }: MobileTimelineProps) {
    if (items.length === 0) {
        return (
            <div className="p-6 text-center text-muted-foreground">
                <p>Nenhuma atividade para exibir.</p>
            </div>
        )
    }

    return (
        <div className={cn("relative", className)}>
            {/* Connecting line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />

            <div className="space-y-1">
                {items.map((item, index) => {
                    const status = statusConfig[item.status]
                    const StatusIcon = status.icon
                    const isLast = index === items.length - 1

                    return (
                        <div
                            key={item.id}
                            className={cn(
                                "relative flex gap-4 p-3 rounded-lg",
                                // Large touch target
                                "min-h-[56px]",
                                // Hover effect
                                "hover:bg-muted/50 active:bg-muted/70 transition-colors",
                                // Cursor
                                "cursor-pointer"
                            )}
                        >
                            {/* Timeline dot */}
                            <div className="relative z-10 flex items-start pt-1">
                                <div
                                    className={cn(
                                        "flex items-center justify-center",
                                        "w-11 h-11 rounded-full", // 44px touch target
                                        "border-4 border-background",
                                        status.bgColor
                                    )}
                                >
                                    <StatusIcon className="h-5 w-5 text-white" />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0 py-1">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0">
                                        <h4 className="font-medium text-sm leading-tight truncate">
                                            {item.title}
                                        </h4>
                                        {item.description && (
                                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                                                {item.description}
                                            </p>
                                        )}
                                    </div>
                                    <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                                </div>

                                {/* Meta info */}
                                <div className="flex items-center gap-3 mt-2">
                                    {item.date && (
                                        <span className="text-xs text-muted-foreground">
                                            {format(item.date, "dd MMM", { locale: ptBR })}
                                        </span>
                                    )}
                                    <span className={cn("text-xs font-medium", status.color)}>
                                        {status.label}
                                    </span>
                                    {item.progress !== undefined && item.progress > 0 && (
                                        <span className="text-xs text-muted-foreground">
                                            {item.progress}%
                                        </span>
                                    )}
                                </div>

                                {/* Progress bar */}
                                {item.progress !== undefined && (
                                    <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                                        <div
                                            className={cn("h-full rounded-full", status.bgColor)}
                                            style={{ width: `${item.progress}%` }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

/**
 * ResponsiveTimeline - Automatically switches between horizontal and vertical timeline
 * based on screen size
 */
export function ResponsiveTimeline({
    items,
    className,
    mobileBreakpoint = 768,
}: MobileTimelineProps & { mobileBreakpoint?: number }) {
    const [isMobile, setIsMobile] = React.useState(false)

    React.useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < mobileBreakpoint)
        }

        checkMobile()
        window.addEventListener("resize", checkMobile)
        return () => window.removeEventListener("resize", checkMobile)
    }, [mobileBreakpoint])

    // Always render MobileTimeline for now (horizontal Gantt is separate)
    // In future, could switch to horizontal on desktop
    return <MobileTimeline items={items} className={className} />
}
