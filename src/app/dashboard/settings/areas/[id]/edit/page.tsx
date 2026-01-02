import { Metadata } from 'next'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { getCurrentUserWithRole } from '@/lib/auth-utils'
import { canManageData } from '@/lib/permissions'
import { prisma } from '@/infrastructure/database/prisma'
import { updateArea } from '../../actions'

export const metadata: Metadata = {
    title: 'Editar Área',
}

export default async function EditAreaPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const user = await getCurrentUserWithRole()

    if (!user || !canManageData(user.role)) {
        redirect('/dashboard/settings/areas')
    }

    const area = await prisma.area.findUnique({
        where: { id },
    })

    if (!area) {
        notFound()
    }

    const updateAreaWithId = updateArea.bind(null, id)

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard/settings/areas">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <h1 className="text-2xl font-bold tracking-tight">Editar Área</h1>
            </div>

            <div className="rounded-md border bg-card p-6 max-w-2xl">
                <form action={updateAreaWithId} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nome da Área</Label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="Ex: Direito Societário"
                            defaultValue={area.name}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Descrição</Label>
                        <Textarea
                            id="description"
                            name="description"
                            placeholder="Descrição da área (opcional)"
                            defaultValue={area.description || ''}
                            rows={3}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="externalUrl">URL Externa</Label>
                        <Input
                            id="externalUrl"
                            name="externalUrl"
                            type="url"
                            placeholder="https://sistema-externo.com (opcional)"
                            defaultValue={area.externalUrl || ''}
                        />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <Button type="submit">Salvar Alterações</Button>
                        <Button type="button" variant="outline" asChild>
                            <Link href="/dashboard/settings/areas">Cancelar</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
