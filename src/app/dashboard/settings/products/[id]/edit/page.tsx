import { Metadata } from 'next'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { getCurrentUserWithRole } from '@/lib/auth-utils'
import { canManageData } from '@/lib/permissions'
import { prisma } from '@/infrastructure/database/prisma'
import { updateProduct } from '../../actions'

export const metadata: Metadata = {
    title: 'Editar Produto',
}

export const dynamic = 'force-dynamic'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const user = await getCurrentUserWithRole()

    if (!user || !canManageData(user.role)) {
        redirect('/dashboard/settings/products')
    }

    const [product, families] = await Promise.all([
        prisma.product.findUnique({ where: { id } }),
        prisma.productFamily.findMany({ orderBy: { code: 'asc' } }),
    ])

    if (!product) {
        notFound()
    }

    const updateProductWithId = updateProduct.bind(null, id)

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard/settings/products">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <h1 className="text-2xl font-bold tracking-tight">Editar Produto</h1>
            </div>

            <div className="rounded-md border bg-card p-6 max-w-2xl">
                <form action={updateProductWithId} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="familyId">Família *</Label>
                        <Select name="familyId" defaultValue={product.familyId} required>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione a família" />
                            </SelectTrigger>
                            <SelectContent>
                                {families.map((family) => (
                                    <SelectItem key={family.id} value={family.id}>
                                        {family.code} - {family.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="code">Código *</Label>
                            <Input
                                id="code"
                                name="code"
                                placeholder="SOC.01.1"
                                defaultValue={product.code}
                                required
                            />
                        </div>
                        <div className="col-span-2 space-y-2">
                            <Label htmlFor="name">Nome *</Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="Constituição de Empresa"
                                defaultValue={product.name}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Descrição</Label>
                        <Textarea
                            id="description"
                            name="description"
                            placeholder="Descrição do produto"
                            defaultValue={product.description || ''}
                            rows={3}
                        />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <Button type="submit">Salvar Alterações</Button>
                        <Button type="button" variant="outline" asChild>
                            <Link href="/dashboard/settings/products">Cancelar</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
