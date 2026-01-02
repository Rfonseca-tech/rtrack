import { Metadata } from 'next'
import Link from 'next/link'
import { Plus, Pencil, Package } from 'lucide-react'

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
import { DeleteProductButton } from './delete-button'

export const metadata: Metadata = {
    title: 'Produtos',
}

export const dynamic = 'force-dynamic'

type ProductWithCount = {
    id: string
    code: string
    name: string
    description: string | null
    family: { code: string; name: string }
    _count: { templateTasks: number }
}

export default async function ProductsPage() {
    const user = await getCurrentUserWithRole()
    const userRole = user?.role

    let products: ProductWithCount[] = []
    let error: string | null = null

    try {
        products = await prisma.product.findMany({
            select: {
                id: true,
                code: true,
                name: true,
                description: true,
                family: { select: { code: true, name: true } },
                _count: { select: { templateTasks: true } },
            },
            orderBy: { code: 'asc' },
        })
    } catch (e) {
        console.error('Error fetching products:', e)
        error = 'Erro ao carregar produtos.'
    }

    const canEdit = canManageData(userRole || undefined)

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Produtos</h1>
                    <p className="text-muted-foreground">Gerencie os produtos e seus templates de tarefas</p>
                </div>
                {canEdit && (
                    <Button asChild>
                        <Link href="/dashboard/settings/products/new">
                            <Plus className="mr-2 h-4 w-4" />
                            Novo Produto
                        </Link>
                    </Button>
                )}
            </div>

            {error ? (
                <div className="rounded-md border bg-destructive/10 p-4 text-destructive">
                    {error}
                </div>
            ) : products.length === 0 ? (
                <div className="rounded-md border bg-card p-8">
                    <div className="flex flex-col items-center justify-center gap-4 text-center">
                        <Package className="h-12 w-12 text-muted-foreground" />
                        <h2 className="text-lg font-semibold">Nenhum produto cadastrado</h2>
                        <p className="text-sm text-muted-foreground max-w-md">
                            Crie produtos como SOC.01.1 - Constituição de Empresa, etc.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[120px]">Código</TableHead>
                                <TableHead>Nome</TableHead>
                                <TableHead>Família</TableHead>
                                <TableHead className="text-center">Templates</TableHead>
                                {canEdit && <TableHead className="w-[100px]">Ações</TableHead>}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell>
                                        <Badge variant="outline">{product.code}</Badge>
                                    </TableCell>
                                    <TableCell className="font-medium">{product.name}</TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {product.family.name}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="secondary">{product._count.templateTasks}</Badge>
                                    </TableCell>
                                    {canEdit && (
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Button variant="ghost" size="icon" asChild className="h-8 w-8">
                                                    <Link href={`/dashboard/settings/products/${product.id}/edit`}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <DeleteProductButton productId={product.id} templatesCount={product._count.templateTasks} />
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
