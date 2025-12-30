import { Metadata } from 'next'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { getCurrentUserWithRole, canManageData } from '@/lib/auth-utils'
import { prisma } from '@/infrastructure/database/prisma'
import { updateProject } from '../../actions'

export const metadata: Metadata = {
    title: 'Editar Projeto',
}

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const user = await getCurrentUserWithRole()

    if (!user || !canManageData(user.role)) {
        redirect('/dashboard/projects')
    }

    const [project, clients, families] = await Promise.all([
        prisma.project.findUnique({
            where: { id },
        }),
        prisma.client.findMany({
            where: { isActive: true },
            orderBy: { razaoSocial: 'asc' }
        }),
        prisma.productFamily.findMany({
            orderBy: { name: 'asc' }
        })
    ])

    if (!project) {
        notFound()
    }

    const updateProjectWithId = updateProject.bind(null, id)

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard/projects">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <h1 className="text-2xl font-bold tracking-tight">Editar Projeto</h1>
            </div>

            <div className="rounded-md border bg-card p-6 max-w-2xl">
                <form action={updateProjectWithId} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nome do Projeto</Label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="Nome do projeto"
                            defaultValue={project.name}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="clientId">Cliente</Label>
                        <Select name="clientId" defaultValue={project.clientId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione um cliente" />
                            </SelectTrigger>
                            <SelectContent>
                                {clients.map((client) => (
                                    <SelectItem key={client.id} value={client.id}>
                                        {client.razaoSocial}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="familyCode">Família de Produto</Label>
                        <Select name="familyCode" defaultValue={project.familyCode}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione uma família" />
                            </SelectTrigger>
                            <SelectContent>
                                {families.map((family) => (
                                    <SelectItem key={family.code} value={family.code}>
                                        {family.code} - {family.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <Button type="submit">Salvar Alterações</Button>
                        <Button type="button" variant="outline" asChild>
                            <Link href="/dashboard/projects">Cancelar</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
