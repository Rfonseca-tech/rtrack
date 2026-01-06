import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
    Briefcase,
    Users,
    CheckCircle2,
    Clock,
    TrendingUp,
    FolderPlus,
    UserPlus,
    ListTodo,
} from 'lucide-react'

import { prisma } from '@/infrastructure/database/prisma'
import { getCurrentUserWithRole } from '@/lib/auth-utils'
import { canManageData } from '@/lib/permissions'

// Bento Grid Components
import { DashboardGrid, BentoCard } from '@/components/dashboard'
import {
    StatCard,
    ProjectsWidget,
    TasksWidget,
    QuickActionsWidget,
    ProgressWidget,
    TeamWidget
} from '@/components/dashboard/widgets'

export const metadata: Metadata = {
    title: 'Dashboard',
}

export const dynamic = 'force-dynamic'

type TaskWithProject = {
    id: string
    title: string
    status: 'PENDING' | 'IN_PROGRESS' | 'WAITING_VALIDATION' | 'COMPLETED'
    dueDate: Date | null
    project: { name: string }
}

type ProjectWithClient = {
    id: string
    name: string
    progress: number
    isActive: boolean
    client: { razaoSocial: string }
    updatedAt: Date
}

async function getDashboardData() {
    const user = await getCurrentUserWithRole()

    if (!user) {
        return null
    }

    // Redirect CLIENT users to the new client portal
    if (user.role === 'CLIENT') {
        redirect('/client')
    }

    const isRestricted = user.role !== 'ROOT' && user.role !== 'ADMIN'

    // Build query conditions
    let projectWhere: any = {}
    let taskWhere: any = { status: { not: 'COMPLETED' } }

    if (isRestricted) {
        projectWhere = {
            collaborators: {
                some: { userId: user.id }
            }
        }
        taskWhere.project = {
            collaborators: {
                some: { userId: user.id }
            }
        }
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
            where: isRestricted ? { ...projectWhere, isActive: true } : { isActive: true }
        }),
        prisma.client.count({
            where: { isActive: true }
        }),
        prisma.task.groupBy({
            by: ['status'],
            _count: { status: true },
            where: isRestricted ? taskWhere : undefined
        }),
        prisma.task.findMany({
            where: taskWhere,
            orderBy: { dueDate: 'asc' },
            take: 6,
            include: { project: { select: { name: true } } },
        }) as Promise<TaskWithProject[]>,
        prisma.project.findMany({
            where: isRestricted ? { ...projectWhere, isActive: true } : { isActive: true },
            orderBy: { updatedAt: 'desc' },
            take: 5,
            include: { client: { select: { razaoSocial: true } } },
        }) as Promise<ProjectWithClient[]>,
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
        isClient: false, // CLIENT users are redirected to /client before reaching here
        canManage: canManageData(user.role),
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

// ================================================================
// ADMIN / LAWYER DASHBOARD VIEW
// ================================================================
function AdminDashboard({ data }: { data: NonNullable<Awaited<ReturnType<typeof getDashboardData>>> }) {
    const {
        user,
        activeProjectsCount,
        projectsCount,
        clientsCount,
        pendingTasks,
        inProgressTasks,
        completedTasks,
        totalTasks,
        recentTasks,
        recentProjects,
    } = data

    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

    // Map projects for widget
    const projectsForWidget = recentProjects.map(p => ({
        id: p.id,
        name: p.name,
        clientName: p.client.razaoSocial,
        status: p.isActive ? 'ACTIVE' as const : 'ARCHIVED' as const,
        progress: p.progress,
    }))

    // Map tasks for widget
    const tasksForWidget = recentTasks.map(t => ({
        id: t.id,
        title: t.title,
        projectName: t.project.name,
        status: t.status,
        dueDate: t.dueDate,
    }))

    const quickActions = [
        { label: 'Novo Projeto', href: '/dashboard/projects/new', icon: FolderPlus },
        { label: 'Novo Cliente', href: '/dashboard/clients/new', icon: UserPlus },
        { label: 'Nova Tarefa', href: '/dashboard/tasks/new', icon: ListTodo },
        { label: 'Ver Projetos', href: '/dashboard/projects', icon: Briefcase },
    ]

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

            {/* Bento Grid */}
            <DashboardGrid>
                {/* Row 1: Stats */}
                <StatCard
                    title="Projetos Ativos"
                    value={activeProjectsCount}
                    description={`de ${projectsCount} projetos totais`}
                    icon={Briefcase}
                />
                <StatCard
                    title="Clientes Ativos"
                    value={clientsCount}
                    description="clientes no sistema"
                    icon={Users}
                />
                <StatCard
                    title="Tarefas Pendentes"
                    value={pendingTasks + inProgressTasks}
                    description={`${pendingTasks} pendentes, ${inProgressTasks} em andamento`}
                    icon={Clock}
                />
                <StatCard
                    title="Taxa de Conclusão"
                    value={`${completionRate}%`}
                    description={`${completedTasks} de ${totalTasks} tarefas`}
                    icon={TrendingUp}
                    trend={completionRate > 50 ? { value: completionRate, isPositive: true } : undefined}
                />

                {/* Row 2: Projects (Wide) + Tasks (Tall) */}
                <ProjectsWidget
                    projects={projectsForWidget}
                    title="Projetos Ativos"
                />

                <TasksWidget
                    tasks={tasksForWidget}
                    title="Tarefas Urgentes"
                />

                {/* Row 3: Quick Actions */}
                <QuickActionsWidget actions={quickActions} />
            </DashboardGrid>
        </div>
    )
}

// ================================================================
// CLIENT DASHBOARD VIEW
// ================================================================
function ClientDashboard({ data }: { data: NonNullable<Awaited<ReturnType<typeof getDashboardData>>> }) {
    const { user, recentProjects, recentTasks, completedTasks, totalTasks } = data

    // Get the client's main project (first active one)
    const mainProject = recentProjects[0]

    // Calculate overall progress
    const overallProgress = totalTasks > 0
        ? Math.round((completedTasks / totalTasks) * 100)
        : 0

    // Mock team data (should come from collaborators in real implementation)
    const teamMembers = [
        { name: 'Dr. Suporte', role: 'Advogado Responsável', email: 'suporte@rfonseca.adv.br' },
    ]

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight">
                    Olá, {user.name?.split(' ')[0] || 'Cliente'}! 👋
                </h1>
                <p className="text-muted-foreground">
                    Acompanhe o progresso do seu caso
                </p>
            </div>

            {/* Bento Grid - Client View */}
            <DashboardGrid>
                {/* Main Project Progress (Wide) */}
                {mainProject ? (
                    <ProgressWidget
                        projectName={mainProject.name}
                        progress={overallProgress}
                        currentPhase="Em Andamento"
                        totalTasks={totalTasks}
                        completedTasks={completedTasks}
                    />
                ) : (
                    <BentoCard size="wide" title="Seu Caso">
                        <p className="text-muted-foreground">
                            Nenhum projeto ativo no momento.
                        </p>
                    </BentoCard>
                )}

                {/* Your Team */}
                <TeamWidget members={teamMembers} />

                {/* Recent Activity */}
                <BentoCard size="tall" title="Atividade Recente" icon={<Clock className="h-4 w-4" />}>
                    <div className="space-y-3">
                        {recentTasks.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                Nenhuma atividade recente.
                            </p>
                        ) : (
                            recentTasks.slice(0, 4).map((task) => (
                                <div key={task.id} className="border-l-2 border-primary/30 pl-3">
                                    <p className="text-sm font-medium">{task.title}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {task.status === 'COMPLETED' ? '✅ Concluída' :
                                            task.status === 'IN_PROGRESS' ? '🔄 Em andamento' :
                                                '⏳ Pendente'}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </BentoCard>

                {/* Next Steps */}
                <BentoCard title="Próximos Passos" icon={<CheckCircle2 className="h-4 w-4" />}>
                    <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                            Aguardando atualizações da equipe jurídica.
                        </p>
                        <Link
                            href="/dashboard/projects"
                            className="inline-flex items-center text-sm text-primary hover:underline"
                        >
                            Ver detalhes do projeto →
                        </Link>
                    </div>
                </BentoCard>
            </DashboardGrid>
        </div>
    )
}

// ================================================================
// MAIN PAGE COMPONENT
// ================================================================
export default async function DashboardPage() {
    const data = await getDashboardData()

    if (!data) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <p className="text-muted-foreground">Carregando...</p>
            </div>
        )
    }

    // Render different dashboard based on user role
    if (data.isClient) {
        return <ClientDashboard data={data} />
    }

    return <AdminDashboard data={data} />
}
