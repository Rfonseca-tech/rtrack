import { Metadata } from 'next'
import { Plus, Briefcase, Pencil } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { prisma } from '@/infrastructure/database/prisma'
import { getCurrentUserWithRole } from '@/lib/auth-utils'
import { canManageData } from '@/lib/permissions'
import { DeleteProjectButton } from './delete-button'

export const metadata: Metadata = {
    title: 'Projetos',
}

export const dynamic = 'force-dynamic'

type ProjectWithRelations = {
    id: string
    name: string
    familyCode: string
    progress: number
    client: {
        razaoSocial: string
    } | null
    family: {
        area: {
            name: string
        } | null
    } | null
}

export default async function ProjectsPage() {
    let projects: ProjectWithRelations[] = []
    let error: string | null = null
    let userRole: string | null = null

    try {
        const user = await getCurrentUserWithRole()
        userRole = user?.role || null

        projects = await prisma.project.findMany({
            include: {
                client: true,
                family: {
                    include: {
                        area: true
                    }
                }
            },
            orderBy: { updatedAt: 'desc' }
        }) as ProjectWithRelations[]
    } catch (e) {
        console.error('Error fetching projects:', e)
        error = 'Erro ao carregar projetos. Verifique a conexão com o banco de dados.'
    }

    const canEdit = canManageData(userRole || undefined)

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Projetos</h1>
                {canEdit && (
                    <Button asChild>
                        <Link href="/dashboard/projects/new">
                            <Plus className="mr-2 h-4 w-4" /> Novo Projeto
                        </Link>
                    </Button>
                )}
            </div>

            <div className="rounded-md border bg-card">
                {error ? (
                    <div className="p-8 text-center text-red-500">
                        <p>{error}</p>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead>Cliente</TableHead>
                                <TableHead>Família</TableHead>
                                <TableHead>Área</TableHead>
                                <TableHead>Progresso</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {projects.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                        <div className="flex flex-col items-center gap-2">
                                            <Briefcase className="h-8 w-8" />
                                            <span>Nenhum projeto encontrado.</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                projects.map((project) => (
                                    <TableRow key={project.id}>
                                        <TableCell className="font-medium">{project.name}</TableCell>
                                        <TableCell>{project.client?.razaoSocial || '-'}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{project.familyCode}</Badge>
                                        </TableCell>
                                        <TableCell>{project.family?.area?.name || '-'}</TableCell>
                                        <TableCell>
                                            <Badge variant={project.progress === 100 ? "default" : "secondary"}>
                                                {project.progress}%
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="sm" asChild>
                                                    <Link href={`/dashboard/projects/${project.id}`}>Detalhes</Link>
                                                </Button>
                                                {canEdit && (
                                                    <>
                                                        <Button variant="ghost" size="icon" asChild>
                                                            <Link href={`/dashboard/projects/${project.id}/edit`}>
                                                                <Pencil className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                        <DeleteProjectButton projectId={project.id} projectName={project.name} />
                                                    </>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                )}
            </div>
        </div>
    )
}
