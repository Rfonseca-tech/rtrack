"use client"

import { useState } from 'react'
import { ChevronDown, ChevronRight, FileText, Calendar, User, CheckCircle2, Clock, AlertCircle, Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { TaskActionMenu } from './task-action-menu'
import { TaskDialog } from './task-dialog'
import { deleteTask } from '@/app/dashboard/tasks/actions'
import { toast } from 'sonner' // Assuming sonner is installed

export type TaskNode = {
    id: string
    title: string
    description: string | null
    status: string
    startDate: Date | null
    dueDate: Date | null
    assignedTo: string | null
    order: number
    documents: { id: string; fileName: string }[]
    children: TaskNode[]
}

interface TaskAccordionProps {
    tasks: TaskNode[]
    projectId: string
    level?: number
}

const statusConfig: Record<string, { icon: React.ReactNode; label: string; color: string; badge: string }> = {
    PENDING: {
        icon: <Clock className="h-3 w-3" />,
        label: 'Pendente',
        color: 'bg-yellow-500',
        badge: 'text-yellow-600 border-yellow-200 bg-yellow-50'
    },
    IN_PROGRESS: {
        icon: <Loader2 className="h-3 w-3 animate-spin" />,
        label: 'Em Andamento',
        color: 'bg-blue-500',
        badge: 'text-blue-600 border-blue-200 bg-blue-50'
    },
    WAITING_VALIDATION: {
        icon: <AlertCircle className="h-3 w-3" />,
        label: 'Aguardando',
        color: 'bg-purple-500',
        badge: 'text-purple-600 border-purple-200 bg-purple-50'
    },
    COMPLETED: {
        icon: <CheckCircle2 className="h-3 w-3" />,
        label: 'Concluída',
        color: 'bg-green-500',
        badge: 'text-green-600 border-green-200 bg-green-50'
    },
}

function formatDate(date: Date | null): string {
    if (!date) return '-'
    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: 'short'
    }).format(new Date(date))
}

interface TaskItemProps {
    task: TaskNode
    level?: number
    onEdit: (task: TaskNode) => void
    onAddSubtask: (parent: TaskNode) => void
    onDelete: (id: string) => void
}

function TaskItem({ task, level = 0, onEdit, onAddSubtask, onDelete }: TaskItemProps) {
    const [isOpen, setIsOpen] = useState(level === 0)
    const hasChildren = task.children.length > 0
    const statusInfo = statusConfig[task.status] || statusConfig.PENDING

    return (
        <div className="group">
            <div
                className={cn(
                    "grid grid-cols-[1fr_120px_120px_150px_120px_50px] items-center gap-2 py-2 px-4 border-b hover:bg-muted/50 transition-colors",
                    level === 0 ? "bg-muted/30 font-medium" : "text-sm",
                    task.status === 'COMPLETED' && "opacity-60"
                )}
            >
                {/* Title Column (Tree) */}
                <div className="flex items-center gap-2 overflow-hidden" style={{ paddingLeft: `${level * 24}px` }}>
                    {hasChildren ? (
                        <button
                            className="p-0.5 hover:bg-muted rounded shrink-0"
                            onClick={(e) => {
                                e.stopPropagation()
                                setIsOpen(!isOpen)
                            }}
                        >
                            {isOpen ? (
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            ) : (
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            )}
                        </button>
                    ) : (
                        <div className="w-5 shrink-0" />
                    )}

                    <span
                        className={cn("truncate", task.status === 'COMPLETED' && "line-through decoration-muted-foreground/50")}
                        title={task.title}
                    >
                        {task.title}
                    </span>

                    {task.documents.length > 0 && (
                        <div title={`${task.documents.length} documentos`} className="flex items-center text-muted-foreground shrink-0">
                            <FileText className="h-3 w-3" />
                            <span className="text-[10px] ml-0.5">{task.documents.length}</span>
                        </div>
                    )}
                </div>

                {/* Start Date */}
                <div className="text-muted-foreground text-xs">
                    {formatDate(task.startDate)}
                </div>

                {/* Due Date */}
                <div className={cn("text-xs", task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'COMPLETED' ? "text-red-500 font-medium" : "text-muted-foreground")}>
                    {formatDate(task.dueDate)}
                </div>

                {/* Responsible */}
                <div>
                    {task.assignedTo ? (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <User className="h-3 w-3" />
                            <span className="truncate max-w-[120px]" title={task.assignedTo}>{task.assignedTo}</span>
                        </div>
                    ) : (
                        <span className="text-xs text-muted-foreground/50 italic">-</span>
                    )}
                </div>

                {/* Status */}
                <div>
                    <Badge variant="outline" className={cn("text-[10px] font-normal gap-1 pr-2", statusInfo.badge)}>
                        {statusInfo.icon}
                        {statusInfo.label}
                    </Badge>
                </div>

                {/* Actions */}
                <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                    <TaskActionMenu
                        task={task}
                        onEdit={onEdit}
                        onAddSubtask={onAddSubtask}
                        onDelete={onDelete}
                    />
                </div>
            </div>

            {/* Children Recursion */}
            {isOpen && hasChildren && (
                <div>
                    {task.children
                        .sort((a, b) => a.order - b.order)
                        .map((child) => (
                            <TaskItem
                                key={child.id}
                                task={child}
                                level={level + 1}
                                onEdit={onEdit}
                                onAddSubtask={onAddSubtask}
                                onDelete={onDelete}
                            />
                        ))}
                </div>
            )}
        </div>
    )
}

export function TaskAccordion({ tasks, projectId }: TaskAccordionProps) {
    const sortedTasks = [...tasks].sort((a, b) => a.order - b.order)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingTask, setEditingTask] = useState<TaskNode | null>(null)
    const [parentTask, setParentTask] = useState<TaskNode | null>(null)

    const handleEdit = (task: TaskNode) => {
        setEditingTask(task)
        setParentTask(null)
        setIsDialogOpen(true)
    }

    const handleAddSubtask = (parent: TaskNode) => {
        setEditingTask(null)
        setParentTask(parent)
        setIsDialogOpen(true)
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir esta tarefa? Todas as subtarefas também serão excluídas.")) return

        const result = await deleteTask(id)
        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success("Tarefa excluída com sucesso")
        }
    }

    return (
        <div className="border rounded-lg shadow-sm bg-card">
            {/* Header */}
            <div className="grid grid-cols-[1fr_120px_120px_150px_120px_50px] gap-2 px-4 py-3 bg-muted/50 border-b text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <div>Tarefa</div>
                <div>Início</div>
                <div>Fim</div>
                <div>Responsável</div>
                <div>Status</div>
                <div className="text-right">Ações</div>
            </div>

            {/* List */}
            <div className="divide-y">
                {sortedTasks.map((task) => (
                    <TaskItem
                        key={task.id}
                        task={task}
                        level={0}
                        onEdit={handleEdit}
                        onAddSubtask={handleAddSubtask}
                        onDelete={handleDelete}
                    />
                ))}
            </div>

            <TaskDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                project={{ id: projectId }}
                taskToEdit={editingTask}
                parentTask={parentTask}
            />
        </div>
    )
}
