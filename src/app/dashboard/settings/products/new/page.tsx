import { Metadata } from 'next'
import { redirect } from 'next/navigation'
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
import { createProduct } from '../actions'

export const metadata: Metadata = {
    title: 'Novo Produto',
}

export const dynamic = 'force-dynamic'

export default async function NewProductPage() {
    const user = await getCurrentUserWithRole()

    if (!user || !canManageData(user.role)) {
        redirect('/dashboard/settings/products')
    }

    const families = await prisma.productFamily.findMany({
        orderBy: { code: 'asc' },
    })

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard/settings/products">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <h1 className="text-2xl font-bold tracking-tight">Novo Produto</h1>
            </div>

            <div className="rounded-md border bg-card p-6 max-w-2xl">
                <form action={createProduct} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="familyId">Família *</Label>
                        <Select name="familyId" required>
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
                                required
                            />
                            <p className="text-xs text-muted-foreground">Ex: SOC.01.1</p>
                        </div>
                        <div className="col-span-2 space-y-2">
                            <Label htmlFor="name">Nome *</Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="Constituição de Empresa"
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
                            rows={3}
                        />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <Button type="submit">Criar Produto</Button>
                        <Button type="button" variant="outline" asChild>
                            <Link href="/dashboard/settings/products">Cancelar</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
