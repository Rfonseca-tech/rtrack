import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, Briefcase, CheckCircle2, Clock, Users, FileText, Plus, BarChart3 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { prisma } from '@/infrastructure/database/prisma'
import { getCurrentUserWithRole } from '@/lib/auth-utils'
import { TaskAccordion } from '@/components/tasks/task-accordion'
import { GanttChart, type GanttTask } from '@/components/gantt'
import { OutcomeTimeline, deriveTimelineStatus, type TimelineMilestone } from '@/components/gantt'

export const metadata: Metadata = {
    title: 'Detalhes do Projeto',
}

export const dynamic = 'force-dynamic'

type TaskNode = {
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

async function buildTaskTree(tasks: TaskNode[]): Promise<TaskNode[]> {
    const taskMap = new Map<string, TaskNode>()
    const rootTasks: TaskNode[] = []

    // Create all task nodes with empty children
    tasks.forEach(task => {
        taskMap.set(task.id, { ...task, children: [] })
    })

    // Build tree structure
    tasks.forEach(task => {
        const node = taskMap.get(task.id)!
        const parentId = (task as unknown as { parentId?: string }).parentId

        if (parentId && taskMap.has(parentId)) {
            taskMap.get(parentId)!.children.push(node)
        } else {
            rootTasks.push(node)
        }
    })

    return rootTasks
}

export default async function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const user = await getCurrentUserWithRole()

    if (!user) {
        notFound()
    }

    const project = await prisma.project.findUnique({
        where: { id },
        include: {
            client: true,
            family: {
                include: { area: true }
            },
            tasks: {
                include: {
                    documents: {
                        select: { id: true, fileName: true }
                    }
                },
                orderBy: { order: 'asc' }
            },
            _count: {
                select: {
                    tasks: true,
                    contracts: true
                }
            }
        }
    })

    if (!project) {
        notFound()
    }

    // Calculate task stats
    const taskStats = project.tasks.reduce((acc, task) => {
        acc[task.status] = (acc[task.status] || 0) + 1
        return acc
    }, {} as Record<string, number>)

    const completedTasks = taskStats['COMPLETED'] || 0
    const pendingTasks = taskStats['PENDING'] || 0
    const inProgressTasks = taskStats['IN_PROGRESS'] || 0
    const waitingTasks = taskStats['WAITING_VALIDATION'] || 0
    const totalTasks = project.tasks.length
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

    // Build task tree for accordion
    const taskTree = await buildTaskTree(project.tasks as unknown as TaskNode[])

    // Check if user is a client
    const isClient = user.role === 'CLIENT'

    // Prepare tasks for Gantt Chart (Admin/Employee view)
    const ganttTasks: GanttTask[] = project.tasks.map(task => ({
        id: task.id,
        title: task.title,
        startDate: task.startDate,
        endDate: task.dueDate,
        progress: task.status === 'COMPLETED' ? 100 : task.status === 'IN_PROGRESS' ? 50 : 0,
        status: task.status as GanttTask['status'],
        parentId: (task as unknown as { parentId?: string }).parentId,
    }))

    // Prepare milestones for Client Timeline
    const timelineMilestones: TimelineMilestone[] = project.tasks
        .filter(t => t.dueDate) // Only tasks with dates
        .sort((a, b) => {
            if (!a.dueDate || !b.dueDate) return 0
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        })
        .slice(0, 8) // Limit to 8 most relevant
        .map(task => ({
            id: task.id,
            title: task.title,
            date: task.dueDate,
            status: deriveTimelineStatus(task.dueDate, task.status === 'COMPLETED'),
            description: task.description || undefined,
        }))

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard/projects">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold tracking-tight">{project.name}</h1>
                    <p className="text-muted-foreground">
                        {project.client.razaoSocial} • {project.family.name}
                    </p>
                </div>
                <Button asChild>
                    <Link href={`/dashboard/tasks/new?projectId=${project.id}`}>
                        <Plus className="mr-2 h-4 w-4" />
                        Nova Tarefa
                    </Link>
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Progresso</CardTitle>
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{progress}%</div>
                        <Progress value={progress} className="mt-2" />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
                        <p className="text-xs text-muted-foreground">de {totalTasks} tarefas</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
                        <Clock className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">{pendingTasks + inProgressTasks}</div>
                        <p className="text-xs text-muted-foreground">{pendingTasks} pendentes, {inProgressTasks} em andamento</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Aguardando</CardTitle>
                        <Users className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-purple-600">{waitingTasks}</div>
                        <p className="text-xs text-muted-foreground">aguardando validação</p>
                    </CardContent>
                </Card>
            </div>

            {/* Timeline/Gantt Section */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="h-5 w-5" />
                                {isClient ? 'Linha do Tempo' : 'Cronograma'}
                            </CardTitle>
                            <CardDescription>
                                {isClient
                                    ? 'Acompanhe as etapas do seu caso'
                                    : 'Visualize o cronograma de tarefas do projeto'}
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {isClient ? (
                        // Client View: Static Timeline
                        <OutcomeTimeline milestones={timelineMilestones} />
                    ) : (
                        // Admin/Employee View: Interactive Gantt
                        <GanttChart
                            tasks={ganttTasks}
                            projectName={project.name}
                        />
                    )}
                </CardContent>
            </Card>

            {/* Tasks Accordion */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Tarefas do Projeto</CardTitle>
                            <CardDescription>
                                Acompanhe o progresso de cada etapa
                            </CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <Badge variant="secondary" className="gap-1">
                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                Concluída
                            </Badge>
                            <Badge variant="secondary" className="gap-1">
                                <div className="w-2 h-2 rounded-full bg-blue-500" />
                                Em Andamento
                            </Badge>
                            <Badge variant="secondary" className="gap-1">
                                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                                Pendente
                            </Badge>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {taskTree.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                            <FileText className="h-12 w-12 mb-4" />
                            <h3 className="text-lg font-medium mb-2">Nenhuma tarefa cadastrada</h3>
                            <p className="text-sm mb-4">Adicione tarefas para acompanhar o progresso do projeto</p>
                            <Button asChild>
                                <Link href={`/dashboard/tasks/new?projectId=${project.id}`}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Adicionar Primeira Tarefa
                                </Link>
                            </Button>
                        </div>
                    ) : (
                        <TaskAccordion tasks={taskTree} projectId={project.id} />
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
