import { Metadata } from 'next'
import { Plus } from 'lucide-react'
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

export const metadata: Metadata = {
    title: 'Projetos',
}

export default async function ProjectsPage() {
    const projects = await prisma.project.findMany({
        include: {
            client: true,
            family: {
                include: {
                    area: true
                }
            }
        },
        orderBy: { updatedAt: 'desc' }
    })

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Projetos</h1>
                <Button asChild>
                    <Link href="/dashboard/projects/new">
                        <Plus className="mr-2 h-4 w-4" /> Novo Projeto
                    </Link>
                </Button>
            </div>

            <div className="rounded-md border bg-card">
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
                                    Nenhum projeto encontrado.
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
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={`/dashboard/projects/${project.id}`}>Detalhes</Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
