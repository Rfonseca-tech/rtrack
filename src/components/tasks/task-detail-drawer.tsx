"use client"

import * as React from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
    CheckCircle2,
    Clock,
    Calendar,
    User,
    FileText,
    X,
    Edit,
    Trash2,
} from "lucide-react"

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

export type TaskDetail = {
    id: string
    title: string
    description: string | null
    status: "PENDING" | "IN_PROGRESS" | "WAITING_VALIDATION" | "COMPLETED"
    startDate: Date | null
    dueDate: Date | null
    assignedTo: string | null
    projectName: string
    documents?: { id: string; fileName: string }[]
}

interface TaskDetailDrawerProps {
    task: TaskDetail | null
    open: boolean
    onOpenChange: (open: boolean) => void
    onEdit?: (taskId: string) => void
    onDelete?: (taskId: string) => void
    readOnly?: boolean
}

const statusConfig = {
    PENDING: {
        label: "Pendente",
        color: "bg-amber-500",
        icon: Clock,
        badgeVariant: "warning" as const,
    },
    IN_PROGRESS: {
        label: "Em Progresso",
        color: "bg-blue-500",
        icon: Clock,
        badgeVariant: "default" as const,
    },
    WAITING_VALIDATION: {
        label: "Aguardando Validação",
        color: "bg-purple-500",
        icon: Clock,
        badgeVariant: "secondary" as const,
    },
    COMPLETED: {
        label: "Concluída",
        color: "bg-emerald-500",
        icon: CheckCircle2,
        badgeVariant: "success" as const,
    },
}

/**
 * TaskDetailDrawer - Glassmorphism side drawer for viewing task details
 * 
 * Features:
 * - Translucent glass effect (backdrop-blur)
 * - Preserves context visibility
 * - Smooth slide-in animation
 * - Optional edit/delete actions
 */
export function TaskDetailDrawer({
    task,
    open,
    onOpenChange,
    onEdit,
    onDelete,
    readOnly = false,
}: TaskDetailDrawerProps) {
    if (!task) return null

    const status = statusConfig[task.status]
    const StatusIcon = status.icon

    // Calculate progress based on status
    const progressValue =
        task.status === "COMPLETED" ? 100 :
            task.status === "WAITING_VALIDATION" ? 75 :
                task.status === "IN_PROGRESS" ? 50 :
                    0

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent variant="glass" className="sm:max-w-md">
                <SheetHeader className="border-b pb-4">
                    <div className="flex items-start justify-between pr-8">
                        <div className="space-y-1">
                            <Badge
                                variant="secondary"
                                className={cn("gap-1", status.color, "text-white border-0")}
                            >
                                <StatusIcon className="h-3 w-3" />
                                {status.label}
                            </Badge>
                            <SheetTitle className="text-xl font-bold">
                                {task.title}
                            </SheetTitle>
                            <SheetDescription className="text-sm">
                                {task.projectName}
                            </SheetDescription>
                        </div>
                    </div>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto py-4 space-y-6">
                    {/* Progress Bar */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Progresso</span>
                            <span className="font-medium">{progressValue}%</span>
                        </div>
                        <Progress value={progressValue} className="h-2" />
                    </div>

                    {/* Description */}
                    {task.description && (
                        <div className="space-y-2">
                            <h4 className="text-sm font-medium flex items-center gap-2">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                Descrição
                            </h4>
                            <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                                {task.description}
                            </p>
                        </div>
                    )}

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4">
                        {task.startDate && (
                            <div className="space-y-1">
                                <h4 className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    Início
                                </h4>
                                <p className="text-sm font-medium">
                                    {format(task.startDate, "dd MMM yyyy", { locale: ptBR })}
                                </p>
                            </div>
                        )}
                        {task.dueDate && (
                            <div className="space-y-1">
                                <h4 className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    Prazo
                                </h4>
                                <p className="text-sm font-medium">
                                    {format(task.dueDate, "dd MMM yyyy", { locale: ptBR })}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Assigned To */}
                    {task.assignedTo && (
                        <div className="space-y-2">
                            <h4 className="text-sm font-medium flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                Responsável
                            </h4>
                            <div className="flex items-center gap-2 bg-muted/50 p-3 rounded-lg">
                                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                                    <User className="h-4 w-4 text-primary" />
                                </div>
                                <span className="text-sm font-medium">{task.assignedTo}</span>
                            </div>
                        </div>
                    )}

                    {/* Documents */}
                    {task.documents && task.documents.length > 0 && (
                        <div className="space-y-2">
                            <h4 className="text-sm font-medium flex items-center gap-2">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                Documentos ({task.documents.length})
                            </h4>
                            <div className="space-y-2">
                                {task.documents.map((doc) => (
                                    <div
                                        key={doc.id}
                                        className="flex items-center gap-2 bg-muted/50 p-2 rounded-lg text-sm hover:bg-muted transition-colors cursor-pointer"
                                    >
                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                        <span className="truncate">{doc.fileName}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Actions Footer */}
                {!readOnly && (onEdit || onDelete) && (
                    <SheetFooter className="border-t pt-4">
                        <div className="flex gap-2 w-full">
                            {onEdit && (
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => onEdit(task.id)}
                                >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Editar
                                </Button>
                            )}
                            {onDelete && (
                                <Button
                                    variant="destructive"
                                    className="flex-1"
                                    onClick={() => onDelete(task.id)}
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Excluir
                                </Button>
                            )}
                        </div>
                    </SheetFooter>
                )}
            </SheetContent>
        </Sheet>
    )
}
