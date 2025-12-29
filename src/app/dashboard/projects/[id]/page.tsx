import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Edit, Users, FileText, CheckSquare } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { prisma } from '@/infrastructure/database/prisma'

interface ProjectDetailPageProps {
    params: Promise<{ id: string }>
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
    const { id } = await params

    const project = await prisma.project.findUnique({
        where: { id },
        include: {
            client: true,
            family: {
                include: {
                    area: true
                }
            },
            tasks: {
                orderBy: { createdAt: 'desc' },
                take: 5
            },
            collaborators: {
                include: {
                    user: true
                }
            },
            contracts: {
                include: {
                    product: true
                }
            }
        }
    })

    if (!project) {
        notFound()
    }

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
                        {project.client?.razaoSocial} • {project.family?.area?.name || 'Sem área'}
                    </p>
                </div>
                <Button variant="outline" asChild>
                    <Link href={`/dashboard/projects/${project.id}/edit`}>
                        <Edit className="mr-2 h-4 w-4" /> Editar
                    </Link>
                </Button>
            </div>

            {/* Progress */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Progresso Geral</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4">
                        <Progress value={project.progress} className="flex-1" />
                        <span className="text-2xl font-bold">{project.progress}%</span>
                    </div>
                </CardContent>
            </Card>

            {/* Info Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Família</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl font-bold">{project.familyCode}</div>
                        <p className="text-xs text-muted-foreground">{project.family?.name}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Colaboradores</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl font-bold">{project.collaborators.length}</div>
                        <p className="text-xs text-muted-foreground">pessoas no projeto</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tarefas</CardTitle>
                        <CheckSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl font-bold">{project.tasks.length}</div>
                        <p className="text-xs text-muted-foreground">tarefas cadastradas</p>
                    </CardContent>
                </Card>
            </div>

            {/* Contracts/Products */}
            <Card>
                <CardHeader>
                    <CardTitle>Produtos Contratados</CardTitle>
                    <CardDescription>Serviços vinculados a este projeto</CardDescription>
                </CardHeader>
                <CardContent>
                    {project.contracts.length === 0 ? (
                        <p className="text-sm text-muted-foreground">Nenhum produto contratado ainda.</p>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {project.contracts.map((contract) => (
                                <Badge key={contract.id} variant="secondary">
                                    {contract.product.code} - {contract.product.name}
                                </Badge>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Recent Tasks */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Tarefas Recentes</CardTitle>
                        <CardDescription>Últimas 5 tarefas do projeto</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/projects/${project.id}/tasks`}>Ver Todas</Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    {project.tasks.length === 0 ? (
                        <p className="text-sm text-muted-foreground">Nenhuma tarefa cadastrada.</p>
                    ) : (
                        <ul className="space-y-2">
                            {project.tasks.map((task) => (
                                <li key={task.id} className="flex items-center justify-between rounded-lg border p-3">
                                    <span className="font-medium">{task.title}</span>
                                    <Badge variant={task.status === 'COMPLETED' ? 'default' : 'secondary'}>
                                        {task.status}
                                    </Badge>
                                </li>
                            ))}
                        </ul>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
