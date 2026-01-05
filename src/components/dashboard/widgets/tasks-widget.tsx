import Link from "next/link"
import { BentoCard } from "../bento-card"
import { ClipboardList, Clock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

interface Task {
    id: string
    title: string
    projectName: string
    status: 'PENDING' | 'IN_PROGRESS' | 'WAITING_VALIDATION' | 'COMPLETED'
    dueDate?: Date | null
}

interface TasksWidgetProps {
    tasks: Task[]
    title?: string
}

const statusColors = {
    PENDING: "text-amber-600",
    IN_PROGRESS: "text-blue-600",
    WAITING_VALIDATION: "text-purple-600",
    COMPLETED: "text-emerald-600",
}

const statusLabels = {
    PENDING: "Pendente",
    IN_PROGRESS: "Em Progresso",
    WAITING_VALIDATION: "Validação",
    COMPLETED: "Concluída",
}

/**
 * TasksWidget - Display a list of urgent/recent tasks
 */
export function TasksWidget({ tasks, title = "Tarefas Urgentes" }: TasksWidgetProps) {
    // Sort by due date (closest first)
    const sortedTasks = [...tasks].sort((a, b) => {
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    })

    return (
        <BentoCard
            size="tall"
            title={title}
            icon={<ClipboardList className="h-4 w-4" />}
        >
            <div className="space-y-2">
                {sortedTasks.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Nenhuma tarefa pendente.</p>
                ) : (
                    sortedTasks.slice(0, 6).map((task) => (
                        <Link
                            key={task.id}
                            href={`/dashboard/tasks`}
                            className="block p-2 -mx-2 rounded hover:bg-muted/50 transition-colors"
                        >
                            <div className="flex items-start gap-2">
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">
                                        {task.title}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate">
                                        {task.projectName}
                                    </p>
                                </div>
                                <span className={`text-xs font-medium ${statusColors[task.status]}`}>
                                    {statusLabels[task.status]}
                                </span>
                            </div>
                            {task.dueDate && (
                                <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                                    <Clock className="h-3 w-3" />
                                    <span>
                                        {formatDistanceToNow(new Date(task.dueDate), {
                                            addSuffix: true,
                                            locale: ptBR
                                        })}
                                    </span>
                                </div>
                            )}
                        </Link>
                    ))
                )}
            </div>
            {sortedTasks.length > 6 && (
                <Link
                    href="/dashboard/tasks"
                    className="block mt-3 pt-3 border-t text-xs text-primary hover:underline text-center"
                >
                    Ver todas ({sortedTasks.length} tarefas)
                </Link>
            )}
        </BentoCard>
    )
}
