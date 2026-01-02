import { Metadata } from 'next'
import Link from 'next/link'
import {
    Briefcase,
    Users,
    CheckCircle2,
    Clock,
    AlertCircle,
    TrendingUp,
    ArrowRight
} from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { prisma } from '@/infrastructure/database/prisma'
import { getCurrentUserWithRole } from '@/lib/auth-utils'

export const metadata: Metadata = {
    title: 'Dashboard',
}

export const dynamic = 'force-dynamic'

type TaskWithProject = {
    id: string
    title: string
    status: string
    dueDate: Date | null
    project: { name: string }
}

type RecentProject = {
    id: string
    name: string
    progress: number
    client: { razaoSocial: string }
    updatedAt: Date
}

async function getDashboardData() {
    const user = await getCurrentUserWithRole()

    if (!user) {
        return null
    }

    // Define filtering conditions based on role
    const isRestricted = user.role !== 'ROOT' && user.role !== 'ADMIN'

    // Default filters (allow everything for admin/root)
    let projectWhere: any = {}
    let taskWhere: any = { status: { not: 'COMPLETED' } }
    let clientWhere: any = { isActive: true }

    if (isRestricted) {
        // Restrict projects to those where user is a collaborator
        projectWhere = {
            collaborators: {
                some: { userId: user.id }
            }
        }

        // Restrict active projects count as well
        projectWhere.isActive = true

        // Restrict tasks to those in allowed projects
        taskWhere.project = {
            collaborators: {
                some: { userId: user.id }
            }
        }
    } else {
        // For admins, just filter by active where applicable for specific counts
        // modifying local vars for specific query calls below or inline
    }

    const [
        projectsCount,
        activeProjectsCount,
        clientsCount,
        tasksStats,
        recentTasks,
        recentProjects,
    ] = await Promise.all([
        prisma.project.count({
            where: isRestricted ? projectWhere : undefined
        }),
        prisma.project.count({
            where: isRestricted ? projectWhere : { isActive: true }
        }),
        prisma.client.count({
            where: clientWhere // Clients might be global? Or should be restricted too? 
            // For now, let's keep clients global or maybe restricted if needed. 
            // If strict, maybe only clients of projects they are on. 
            // Let's assume clients are global for now OR restrict if needed.
            // Safe bet: only count clients they have access to projects for.
        }),
        prisma.task.groupBy({
            by: ['status'],
            _count: { status: true },
            where: isRestricted ? taskWhere : undefined
        }),
        prisma.task.findMany({
            where: taskWhere,
            orderBy: { dueDate: 'asc' },
            take: 5,
            include: { project: { select: { name: true } } },
        }) as Promise<TaskWithProject[]>,
        prisma.project.findMany({
            where: isRestricted ? projectWhere : { isActive: true },
            orderBy: { updatedAt: 'desc' },
            take: 5,
            include: { client: { select: { razaoSocial: true } } },
        }) as Promise<RecentProject[]>,
    ])

    // Process task stats
    const taskStatsMap = tasksStats.reduce((acc, stat) => {
        acc[stat.status] = stat._count.status
        return acc
    }, {} as Record<string, number>)

    const pendingTasks = taskStatsMap['PENDING'] || 0
    const inProgressTasks = taskStatsMap['IN_PROGRESS'] || 0
    const completedTasks = taskStatsMap['COMPLETED'] || 0
    const waitingValidationTasks = taskStatsMap['WAITING_VALIDATION'] || 0
    const totalTasks = pendingTasks + inProgressTasks + completedTasks + waitingValidationTasks

    return {
        user,
        projectsCount,
        activeProjectsCount,
        clientsCount,
        pendingTasks,
        inProgressTasks,
        completedTasks,
        waitingValidationTasks,
        totalTasks,
        recentTasks,
        recentProjects,
    }
}

const statusLabels: Record<string, string> = {
    PENDING: 'Pendente',
    IN_PROGRESS: 'Em Andamento',
    WAITING_VALIDATION: 'Aguardando Validação',
    COMPLETED: 'Concluída',
}

const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-500',
    IN_PROGRESS: 'bg-blue-500',
    WAITING_VALIDATION: 'bg-purple-500',
    COMPLETED: 'bg-green-500',
}

export default async function DashboardPage() {
    const data = await getDashboardData()

    if (!data) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <p className="text-muted-foreground">Carregando...</p>
            </div>
        )
    }

    const {
        user,
        projectsCount,
        activeProjectsCount,
        clientsCount,
        pendingTasks,
        inProgressTasks,
        completedTasks,
        totalTasks,
        recentTasks,
        recentProjects
    } = data

    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight">
                    Olá, {user.name?.split(' ')[0] || 'Usuário'}! 👋
                </h1>
                <p className="text-muted-foreground">
                    Aqui está um resumo do seu escritório
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Projetos Ativos</CardTitle>
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeProjectsCount}</div>
                        <p className="text-xs text-muted-foreground">
                            de {projectsCount} projetos totais
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Clientes</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{clientsCount}</div>
                        <p className="text-xs text-muted-foreground">
                            clientes ativos
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tarefas Pendentes</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pendingTasks + inProgressTasks}</div>
                        <p className="text-xs text-muted-foreground">
                            {pendingTasks} pendentes, {inProgressTasks} em andamento
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{completionRate}%</div>
                        <div className="mt-2 h-2 w-full bg-secondary rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary transition-all"
                                style={{ width: `${completionRate}%` }}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid gap-4 md:grid-cols-2">
                {/* Recent Tasks */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Tarefas Recentes</CardTitle>
                                <CardDescription>Próximas tarefas a serem concluídas</CardDescription>
                            </div>
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/dashboard/tasks">
                                    Ver todas <ArrowRight className="ml-1 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {recentTasks.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                                <CheckCircle2 className="h-8 w-8 mb-2" />
                                <p className="text-sm">Nenhuma tarefa pendente</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {recentTasks.map((task) => (
                                    <div key={task.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                                        <div className={`w-2 h-2 rounded-full ${statusColors[task.status]}`} />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{task.title}</p>
                                            <p className="text-xs text-muted-foreground truncate">{task.project.name}</p>
                                        </div>
                                        <Badge variant="secondary" className="shrink-0 text-xs">
                                            {statusLabels[task.status]}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Recent Projects */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Projetos Recentes</CardTitle>
                                <CardDescription>Últimos projetos atualizados</CardDescription>
                            </div>
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/dashboard/projects">
                                    Ver todos <ArrowRight className="ml-1 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {recentProjects.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                                <Briefcase className="h-8 w-8 mb-2" />
                                <p className="text-sm">Nenhum projeto encontrado</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {recentProjects.map((project) => (
                                    <Link
                                        key={project.id}
                                        href={`/dashboard/projects/${project.id}`}
                                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{project.name}</p>
                                            <p className="text-xs text-muted-foreground truncate">{project.client.razaoSocial}</p>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <div className="w-16 h-2 bg-secondary rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full transition-all ${project.progress === 100 ? 'bg-green-500' : 'bg-primary'}`}
                                                    style={{ width: `${project.progress}%` }}
                                                />
                                            </div>
                                            <span className="text-xs text-muted-foreground w-8">{project.progress}%</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Ações Rápidas</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        <Button asChild variant="outline">
                            <Link href="/dashboard/projects/new">
                                <Briefcase className="mr-2 h-4 w-4" />
                                Novo Projeto
                            </Link>
                        </Button>
                        <Button asChild variant="outline">
                            <Link href="/dashboard/clients/new">
                                <Users className="mr-2 h-4 w-4" />
                                Novo Cliente
                            </Link>
                        </Button>
                        <Button asChild variant="outline">
                            <Link href="/dashboard/tasks/new">
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Nova Tarefa
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
