import { Metadata } from 'next'
import Link from 'next/link'
import { Plus, Pencil } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { prisma } from '@/infrastructure/database/prisma'
import { getCurrentUserWithRole } from '@/lib/auth-utils'
import { canManageData } from '@/lib/permissions'
import { TaskStatusBadge } from '@/components/tasks/task-status-badge'
import { DeleteTaskButton } from './delete-button'

export const metadata: Metadata = {
    title: 'Tarefas',
}

type TaskWithProject = {
    id: string
    title: string
    status: 'PENDING' | 'IN_PROGRESS' | 'WAITING_VALIDATION' | 'COMPLETED'
    dueDate: Date | null
    project: {
        id: string
        name: string
        client: {
            razaoSocial: string
        }
    }
}

export default async function TasksPage() {
    const user = await getCurrentUserWithRole()
    const userRole = user?.role

    let tasks: TaskWithProject[] = []
    let error: string | null = null

    try {
        tasks = await prisma.task.findMany({
            select: {
                id: true,
                title: true,
                status: true,
                dueDate: true,
                project: {
                    select: {
                        id: true,
                        name: true,
                        client: {
                            select: {
                                razaoSocial: true
                            }
                        }
                    }
                }
            },
            orderBy: [
                { status: 'asc' },
                { dueDate: 'asc' },
            ],
        })
    } catch (e) {
        console.error('Error fetching tasks:', e)
        error = 'Erro ao carregar tarefas.'
    }

    const canEdit = canManageData(userRole || undefined)

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Tarefas</h1>
                {canEdit && (
                    <Button asChild>
                        <Link href="/dashboard/tasks/new">
                            <Plus className="mr-2 h-4 w-4" />
                            Nova Tarefa
                        </Link>
                    </Button>
                )}
            </div>

            {error ? (
                <div className="rounded-md border bg-destructive/10 p-4 text-destructive">
                    {error}
                </div>
            ) : tasks.length === 0 ? (
                <div className="rounded-md border bg-card p-8">
                    <div className="flex flex-col items-center justify-center gap-4 text-center">
                        <h2 className="text-lg font-semibold">Nenhuma tarefa encontrada</h2>
                        <p className="text-sm text-muted-foreground max-w-md">
                            Crie sua primeira tarefa clicando no botão acima.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Tarefa</TableHead>
                                <TableHead>Projeto</TableHead>
                                <TableHead>Cliente</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Prazo</TableHead>
                                {canEdit && <TableHead className="w-[100px]">Ações</TableHead>}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tasks.map((task) => (
                                <TableRow key={task.id}>
                                    <TableCell className="font-medium">{task.title}</TableCell>
                                    <TableCell>
                                        <Link
                                            href={`/dashboard/projects/${task.project.id}`}
                                            className="text-primary hover:underline"
                                        >
                                            {task.project.name}
                                        </Link>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {task.project.client.razaoSocial}
                                    </TableCell>
                                    <TableCell>
                                        <TaskStatusBadge status={task.status} />
                                    </TableCell>
                                    <TableCell>
                                        {task.dueDate
                                            ? new Date(task.dueDate).toLocaleDateString('pt-BR')
                                            : '-'
                                        }
                                    </TableCell>
                                    {canEdit && (
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Button variant="ghost" size="icon" asChild className="h-8 w-8">
                                                    <Link href={`/dashboard/tasks/${task.id}/edit`}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <DeleteTaskButton taskId={task.id} />
                                            </div>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    )
}
