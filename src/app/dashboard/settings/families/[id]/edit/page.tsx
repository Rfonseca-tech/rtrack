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
import { updateFamily } from '../../actions'

export const metadata: Metadata = {
    title: 'Editar Família',
}

export const dynamic = 'force-dynamic'

export default async function EditFamilyPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const user = await getCurrentUserWithRole()

    if (!user || !canManageData(user.role)) {
        redirect('/dashboard/settings/families')
    }

    const [family, areas] = await Promise.all([
        prisma.productFamily.findUnique({ where: { id } }),
        prisma.area.findMany({ orderBy: { name: 'asc' } }),
    ])

    if (!family) {
        notFound()
    }

    const updateFamilyWithId = updateFamily.bind(null, id)

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard/settings/families">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <h1 className="text-2xl font-bold tracking-tight">Editar Família</h1>
            </div>

            <div className="rounded-md border bg-card p-6 max-w-2xl">
                <form action={updateFamilyWithId} className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="code">Código *</Label>
                            <Input
                                id="code"
                                name="code"
                                placeholder="SOC.01"
                                defaultValue={family.code}
                                required
                            />
                        </div>
                        <div className="col-span-2 space-y-2">
                            <Label htmlFor="name">Nome *</Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="Societário"
                                defaultValue={family.name}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="areaId">Área</Label>
                        <Select name="areaId" defaultValue={family.areaId || undefined}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione a área (opcional)" />
                            </SelectTrigger>
                            <SelectContent>
                                {areas.map((area) => (
                                    <SelectItem key={area.id} value={area.id}>
                                        {area.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Descrição</Label>
                        <Textarea
                            id="description"
                            name="description"
                            placeholder="Descrição da família de produtos"
                            defaultValue={family.description || ''}
                            rows={3}
                        />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <Button type="submit">Salvar Alterações</Button>
                        <Button type="button" variant="outline" asChild>
                            <Link href="/dashboard/settings/families">Cancelar</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
