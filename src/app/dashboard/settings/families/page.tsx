import { Metadata } from 'next'
import Link from 'next/link'
import { Plus, Pencil, FolderTree } from 'lucide-react'

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
import { DeleteFamilyButton } from './delete-button'

export const metadata: Metadata = {
    title: 'Famílias de Produtos',
}

export const dynamic = 'force-dynamic'

type FamilyWithCount = {
    id: string
    code: string
    name: string
    description: string | null
    area: { name: string } | null
    _count: { products: number }
}

export default async function FamiliesPage() {
    const user = await getCurrentUserWithRole()
    const userRole = user?.role

    let families: FamilyWithCount[] = []
    let error: string | null = null

    try {
        families = await prisma.productFamily.findMany({
            select: {
                id: true,
                code: true,
                name: true,
                description: true,
                area: { select: { name: true } },
                _count: { select: { products: true } },
            },
            orderBy: { code: 'asc' },
        })
    } catch (e) {
        console.error('Error fetching families:', e)
        error = 'Erro ao carregar famílias.'
    }

    const canEdit = canManageData(userRole || undefined)

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Famílias de Produtos</h1>
                    <p className="text-muted-foreground">Gerencie as famílias de produtos do escritório</p>
                </div>
                {canEdit && (
                    <Button asChild>
                        <Link href="/dashboard/settings/families/new">
                            <Plus className="mr-2 h-4 w-4" />
                            Nova Família
                        </Link>
                    </Button>
                )}
            </div>

            {error ? (
                <div className="rounded-md border bg-destructive/10 p-4 text-destructive">
                    {error}
                </div>
            ) : families.length === 0 ? (
                <div className="rounded-md border bg-card p-8">
                    <div className="flex flex-col items-center justify-center gap-4 text-center">
                        <FolderTree className="h-12 w-12 text-muted-foreground" />
                        <h2 className="text-lg font-semibold">Nenhuma família cadastrada</h2>
                        <p className="text-sm text-muted-foreground max-w-md">
                            Crie famílias como SOC.01 - Societário, TRIB.01 - Tributário, etc.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Código</TableHead>
                                <TableHead>Nome</TableHead>
                                <TableHead>Área</TableHead>
                                <TableHead className="text-center">Produtos</TableHead>
                                {canEdit && <TableHead className="w-[100px]">Ações</TableHead>}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {families.map((family) => (
                                <TableRow key={family.id}>
                                    <TableCell>
                                        <Badge variant="outline">{family.code}</Badge>
                                    </TableCell>
                                    <TableCell className="font-medium">{family.name}</TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {family.area?.name || '-'}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="secondary">{family._count.products}</Badge>
                                    </TableCell>
                                    {canEdit && (
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Button variant="ghost" size="icon" asChild className="h-8 w-8">
                                                    <Link href={`/dashboard/settings/families/${family.id}/edit`}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <DeleteFamilyButton familyId={family.id} productsCount={family._count.products} />
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
