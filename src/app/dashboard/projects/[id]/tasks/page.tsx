import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { prisma } from '@/infrastructure/database/prisma'

interface TasksPageProps {
    params: Promise<{ id: string }>
}

const statusLabels: Record<string, string> = {
    PENDING: 'Pendente',
    IN_PROGRESS: 'Em Andamento',
    WAITING_VALIDATION: 'Aguardando Validação',
    COMPLETED: 'Concluída',
}

const statusColors: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    PENDING: 'outline',
    IN_PROGRESS: 'secondary',
    WAITING_VALIDATION: 'destructive',
    COMPLETED: 'default',
}

export default async function ProjectTasksPage({ params }: TasksPageProps) {
    const { id } = await params

    const project = await prisma.project.findUnique({
        where: { id },
        include: {
            tasks: {
                orderBy: { createdAt: 'asc' }
            }
        }
    })

    if (!project) {
        notFound()
    }

    // Group tasks by status for Kanban view
    const columns = ['PENDING', 'IN_PROGRESS', 'WAITING_VALIDATION', 'COMPLETED']
    const tasksByStatus = columns.reduce((acc, status) => {
        acc[status] = project.tasks.filter(task => task.status === status)
        return acc
    }, {} as Record<string, typeof project.tasks>)

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href={`/dashboard/projects/${project.id}`}>
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold tracking-tight">Tarefas</h1>
                    <p className="text-muted-foreground">{project.name}</p>
                </div>
                <Button asChild>
                    <Link href={`/dashboard/projects/${project.id}/tasks/new`}>
                        <Plus className="mr-2 h-4 w-4" /> Nova Tarefa
                    </Link>
                </Button>
            </div>

            {/* Kanban Board */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                {columns.map((status) => (
                    <Card key={status} className="flex flex-col">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center justify-between text-sm font-medium">
                                <span>{statusLabels[status]}</span>
                                <Badge variant={statusColors[status]}>
                                    {tasksByStatus[status].length}
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 space-y-2">
                            {tasksByStatus[status].length === 0 ? (
                                <p className="text-center text-xs text-muted-foreground py-8">
                                    Nenhuma tarefa
                                </p>
                            ) : (
                                tasksByStatus[status].map((task) => (
                                    <div
                                        key={task.id}
                                        className="rounded-lg border bg-card p-3 shadow-sm hover:shadow-md transition-shadow"
                                    >
                                        <h3 className="font-medium text-sm">{task.title}</h3>
                                        {task.description && (
                                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                                {task.description}
                                            </p>
                                        )}
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
