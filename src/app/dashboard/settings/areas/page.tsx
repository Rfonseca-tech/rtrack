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
import { DeleteAreaButton } from './delete-button'

export const metadata: Metadata = {
    title: 'Áreas',
}

export const dynamic = 'force-dynamic'

type AreaWithCount = {
    id: string
    name: string
    description: string | null
    _count: {
        users: number
    }
}

export default async function AreasPage() {
    const user = await getCurrentUserWithRole()
    const userRole = user?.role

    let areas: AreaWithCount[] = []
    let error: string | null = null

    try {
        areas = await prisma.area.findMany({
            select: {
                id: true,
                name: true,
                description: true,
                _count: {
                    select: { users: true }
                }
            },
            orderBy: { name: 'asc' },
        })
    } catch (e) {
        console.error('Error fetching areas:', e)
        error = 'Erro ao carregar áreas.'
    }

    const canEdit = canManageData(userRole || undefined)

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Áreas</h1>
                    <p className="text-muted-foreground">Gerencie as áreas de atuação do escritório</p>
                </div>
                {canEdit && (
                    <Button asChild>
                        <Link href="/dashboard/settings/areas/new">
                            <Plus className="mr-2 h-4 w-4" />
                            Nova Área
                        </Link>
                    </Button>
                )}
            </div>

            {error ? (
                <div className="rounded-md border bg-destructive/10 p-4 text-destructive">
                    {error}
                </div>
            ) : areas.length === 0 ? (
                <div className="rounded-md border bg-card p-8">
                    <div className="flex flex-col items-center justify-center gap-4 text-center">
                        <h2 className="text-lg font-semibold">Nenhuma área cadastrada</h2>
                        <p className="text-sm text-muted-foreground max-w-md">
                            Crie áreas como Direito Societário, Tributário, Trabalhista, etc.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead>Descrição</TableHead>
                                <TableHead className="text-center">Usuários</TableHead>
                                {canEdit && <TableHead className="w-[100px]">Ações</TableHead>}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {areas.map((area) => (
                                <TableRow key={area.id}>
                                    <TableCell className="font-medium">{area.name}</TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {area.description || '-'}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {area._count.users}
                                    </TableCell>
                                    {canEdit && (
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Button variant="ghost" size="icon" asChild className="h-8 w-8">
                                                    <Link href={`/dashboard/settings/areas/${area.id}/edit`}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <DeleteAreaButton areaId={area.id} />
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
