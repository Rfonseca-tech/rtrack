'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight, FileText, Calendar, User, CheckCircle2, Clock, AlertCircle, Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

type TaskNode = {
    id: string
    title: string
    description: string | null
    status: string
    dueDate: Date | null
    assignedTo: string | null
    order: number
    documents: { id: string; fileName: string }[]
    children: TaskNode[]
}

interface TaskAccordionProps {
    tasks: TaskNode[]
    level?: number
}

const statusConfig: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
    PENDING: {
        icon: <Clock className="h-4 w-4" />,
        label: 'Pendente',
        color: 'bg-yellow-500'
    },
    IN_PROGRESS: {
        icon: <Loader2 className="h-4 w-4 animate-spin" />,
        label: 'Em Andamento',
        color: 'bg-blue-500'
    },
    WAITING_VALIDATION: {
        icon: <AlertCircle className="h-4 w-4" />,
        label: 'Aguardando',
        color: 'bg-purple-500'
    },
    COMPLETED: {
        icon: <CheckCircle2 className="h-4 w-4" />,
        label: 'Concluída',
        color: 'bg-green-500'
    },
}

function formatDate(date: Date | null): string {
    if (!date) return ''
    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: 'short'
    }).format(new Date(date))
}

function TaskItem({ task, level = 0 }: { task: TaskNode; level?: number }) {
    const [isOpen, setIsOpen] = useState(level === 0)
    const hasChildren = task.children.length > 0
    const statusInfo = statusConfig[task.status] || statusConfig.PENDING

    return (
        <div className={cn("border-l-2", level > 0 && "ml-4 mt-1")}>
            <div
                className={cn(
                    "flex items-center gap-2 p-3 rounded-r-lg transition-colors",
                    "hover:bg-muted/50 cursor-pointer",
                    level === 0 && "bg-muted/30 font-medium"
                )}
                onClick={() => hasChildren && setIsOpen(!isOpen)}
            >
                {/* Expand/Collapse Button */}
                {hasChildren ? (
                    <button className="p-1 hover:bg-muted rounded">
                        {isOpen ? (
                            <ChevronDown className="h-4 w-4" />
                        ) : (
                            <ChevronRight className="h-4 w-4" />
                        )}
                    </button>
                ) : (
                    <div className="w-6" />
                )}

                {/* Status Indicator */}
                <div className={cn("w-3 h-3 rounded-full shrink-0", statusInfo.color)}
                    title={statusInfo.label}
                />

                {/* Task Title */}
                <span className={cn(
                    "flex-1 text-sm",
                    task.status === 'COMPLETED' && "line-through text-muted-foreground"
                )}>
                    {task.title}
                </span>

                {/* Assigned To */}
                {task.assignedTo && (
                    <Badge variant="outline" className="text-xs shrink-0">
                        <User className="h-3 w-3 mr-1" />
                        {task.assignedTo}
                    </Badge>
                )}

                {/* Due Date */}
                {task.dueDate && (
                    <Badge variant="secondary" className="text-xs shrink-0">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(task.dueDate)}
                    </Badge>
                )}

                {/* Documents Count */}
                {task.documents.length > 0 && (
                    <Badge variant="secondary" className="text-xs shrink-0">
                        <FileText className="h-3 w-3 mr-1" />
                        {task.documents.length}
                    </Badge>
                )}
            </div>

            {/* Description */}
            {isOpen && task.description && (
                <div className="ml-10 px-3 py-2 text-sm text-muted-foreground bg-muted/20 rounded-lg mx-3 mb-2">
                    {task.description}
                </div>
            )}

            {/* Children */}
            {isOpen && hasChildren && (
                <div className="ml-2">
                    {task.children
                        .sort((a, b) => a.order - b.order)
                        .map((child) => (
                            <TaskItem key={child.id} task={child} level={level + 1} />
                        ))}
                </div>
            )}
        </div>
    )
}

export function TaskAccordion({ tasks, level = 0 }: TaskAccordionProps) {
    const sortedTasks = [...tasks].sort((a, b) => a.order - b.order)

    return (
        <div className="space-y-2">
            {sortedTasks.map((task) => (
                <TaskItem key={task.id} task={task} level={level} />
            ))}
        </div>
    )
}
