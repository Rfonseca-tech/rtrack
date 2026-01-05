"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import {
    format,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    eachWeekOfInterval,
    differenceInDays,
    isToday,
    isSameMonth,
    addMonths,
    subMonths,
    startOfWeek,
    endOfWeek,
} from "date-fns"
import { ptBR } from "date-fns/locale"
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react"
import { Button } from "@/components/ui/button"

export type GanttTask = {
    id: string
    title: string
    startDate: Date | null
    endDate: Date | null
    progress: number // 0-100
    status: "PENDING" | "IN_PROGRESS" | "WAITING_VALIDATION" | "COMPLETED"
    parentId?: string | null
}

interface GanttChartProps {
    tasks: GanttTask[]
    projectName?: string
    className?: string
}

type ZoomLevel = "day" | "week" | "month"

const statusColors: Record<string, string> = {
    PENDING: "bg-amber-500",
    IN_PROGRESS: "bg-blue-500",
    WAITING_VALIDATION: "bg-purple-500",
    COMPLETED: "bg-emerald-500",
}

const statusLabels: Record<string, string> = {
    PENDING: "Pendente",
    IN_PROGRESS: "Em Progresso",
    WAITING_VALIDATION: "Validação",
    COMPLETED: "Concluída",
}

/**
 * GanttChart - Interactive timeline visualization for tasks
 * 
 * Features:
 * - Zoom levels: Day/Week/Month
 * - Task bars with progress indicators
 * - Today marker
 * - Navigation between months
 */
export function GanttChart({ tasks, projectName, className }: GanttChartProps) {
    const [currentDate, setCurrentDate] = React.useState(new Date())
    const [zoom, setZoom] = React.useState<ZoomLevel>("week")

    // Calculate date range based on zoom
    const getDateRange = () => {
        switch (zoom) {
            case "day":
                return eachDayOfInterval({
                    start: startOfMonth(currentDate),
                    end: endOfMonth(currentDate),
                })
            case "week":
                return eachWeekOfInterval(
                    {
                        start: startOfMonth(currentDate),
                        end: endOfMonth(currentDate),
                    },
                    { locale: ptBR }
                )
            case "month":
                return eachDayOfInterval({
                    start: startOfMonth(currentDate),
                    end: endOfMonth(addMonths(currentDate, 2)),
                })
            default:
                return eachDayOfInterval({
                    start: startOfMonth(currentDate),
                    end: endOfMonth(currentDate),
                })
        }
    }

    const dates = getDateRange()
    const totalDays = dates.length

    // Calculate task position and width
    const getTaskPosition = (task: GanttTask) => {
        if (!task.startDate || !task.endDate) return null

        const rangeStart = dates[0]
        const rangeEnd = dates[dates.length - 1]

        // If task is completely outside the visible range, hide it
        if (task.endDate < rangeStart || task.startDate > rangeEnd) {
            return null
        }

        const taskStart = task.startDate < rangeStart ? rangeStart : task.startDate
        const taskEnd = task.endDate > rangeEnd ? rangeEnd : task.endDate

        const startOffset = differenceInDays(taskStart, rangeStart)
        const duration = differenceInDays(taskEnd, taskStart) + 1

        const left = (startOffset / totalDays) * 100
        const width = (duration / totalDays) * 100

        return { left: `${Math.max(0, left)}%`, width: `${Math.min(100 - left, width)}%` }
    }

    // Navigation
    const goToPreviousMonth = () => setCurrentDate(subMonths(currentDate, 1))
    const goToNextMonth = () => setCurrentDate(addMonths(currentDate, 1))
    const goToToday = () => setCurrentDate(new Date())

    // Zoom controls
    const zoomIn = () => {
        if (zoom === "month") setZoom("week")
        else if (zoom === "week") setZoom("day")
    }
    const zoomOut = () => {
        if (zoom === "day") setZoom("week")
        else if (zoom === "week") setZoom("month")
    }

    // Format header based on zoom level
    const formatHeader = (date: Date) => {
        switch (zoom) {
            case "day":
                return format(date, "d", { locale: ptBR })
            case "week":
                return format(date, "'Sem' w", { locale: ptBR })
            case "month":
                return format(date, "d", { locale: ptBR })
        }
    }

    // Filter tasks with dates
    const tasksWithDates = tasks.filter(t => t.startDate && t.endDate)

    return (
        <div className={cn("border rounded-lg bg-card", className)}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
                <div>
                    {projectName && (
                        <h3 className="font-semibold text-lg">{projectName}</h3>
                    )}
                    <p className="text-sm text-muted-foreground">
                        {format(currentDate, "MMMM yyyy", { locale: ptBR })}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {/* Zoom controls */}
                    <div className="flex items-center gap-1 mr-2">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={zoomOut}
                            disabled={zoom === "month"}
                        >
                            <ZoomOut className="h-4 w-4" />
                        </Button>
                        <span className="text-xs text-muted-foreground w-12 text-center">
                            {zoom === "day" ? "Dia" : zoom === "week" ? "Semana" : "Mês"}
                        </span>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={zoomIn}
                            disabled={zoom === "day"}
                        >
                            <ZoomIn className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Navigation */}
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={goToPreviousMonth}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="h-8" onClick={goToToday}>
                        Hoje
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={goToNextMonth}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Timeline Header */}
            <div className="flex border-b">
                {/* Task names column */}
                <div className="w-48 shrink-0 p-2 border-r font-medium text-sm bg-muted/30">
                    Tarefas
                </div>
                {/* Date headers */}
                <div className="flex-1 overflow-x-auto">
                    <div className="flex min-w-max">
                        {dates.map((date, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "flex-1 min-w-[40px] p-1 text-center text-xs border-r last:border-r-0",
                                    isToday(date) && "bg-primary/10 font-bold",
                                    !isSameMonth(date, currentDate) && "text-muted-foreground bg-muted/20"
                                )}
                            >
                                {formatHeader(date)}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Task Rows */}
            <div className="divide-y">
                {tasksWithDates.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                        <p>Nenhuma tarefa com datas definidas.</p>
                        <p className="text-sm mt-1">
                            Adicione datas de início e fim às tarefas para visualizar o cronograma.
                        </p>
                    </div>
                ) : (
                    tasksWithDates.map((task) => {
                        const position = getTaskPosition(task)

                        return (
                            <div key={task.id} className="flex hover:bg-muted/30 transition-colors">
                                {/* Task name */}
                                <div className="w-48 shrink-0 p-2 border-r">
                                    <p className="text-sm font-medium truncate">{task.title}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {statusLabels[task.status]}
                                    </p>
                                </div>

                                {/* Timeline bar */}
                                <div className="flex-1 relative h-14 overflow-hidden">
                                    {/* Today marker */}
                                    {dates.some(d => isToday(d)) && (
                                        <div
                                            className="absolute top-0 bottom-0 w-px bg-red-500 z-10"
                                            style={{
                                                left: `${(dates.findIndex(d => isToday(d)) / totalDays) * 100}%`,
                                            }}
                                        />
                                    )}

                                    {/* Task bar */}
                                    {position && (
                                        <div
                                            className="absolute top-2 h-10 flex items-center"
                                            style={{ left: position.left, width: position.width }}
                                        >
                                            <div
                                                className={cn(
                                                    "h-8 w-full rounded relative overflow-hidden",
                                                    statusColors[task.status]
                                                )}
                                            >
                                                {/* Progress bar inside */}
                                                <div
                                                    className="absolute inset-0 bg-black/20"
                                                    style={{ width: `${100 - task.progress}%`, right: 0, left: 'auto' }}
                                                />
                                                {/* Task title on bar */}
                                                <span className="absolute inset-0 flex items-center px-2 text-xs text-white font-medium truncate">
                                                    {task.title} ({task.progress}%)
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })
                )}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 p-3 border-t bg-muted/30 text-xs">
                <span className="text-muted-foreground">Legenda:</span>
                {Object.entries(statusColors).map(([status, color]) => (
                    <div key={status} className="flex items-center gap-1">
                        <div className={cn("w-3 h-3 rounded", color)} />
                        <span>{statusLabels[status]}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
