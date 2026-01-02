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
import { getCurrentUserWithRole } from '@/lib/auth-utils'
import { canManageData } from '@/lib/permissions'
import { prisma } from '@/infrastructure/database/prisma'
import { updateUser } from '../../actions'

export const metadata: Metadata = {
    title: 'Editar Usuário',
}

const roleOptions = [
    { value: 'ADMIN', label: 'Administrador' },
    { value: 'EMPLOYEE', label: 'Funcionário' },
    { value: 'CLIENT', label: 'Cliente' },
]

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const currentUser = await getCurrentUserWithRole()

    if (!currentUser || !canManageData(currentUser.role)) {
        redirect('/dashboard/settings/users')
    }

    const [userToEdit, areas] = await Promise.all([
        prisma.user.findUnique({
            where: { id },
        }),
        prisma.area.findMany({
            orderBy: { name: 'asc' }
        })
    ])

    if (!userToEdit) {
        notFound()
    }

    // ADMIN cannot edit ROOT users - only ROOT can
    if (userToEdit.role === 'ROOT' && currentUser.role !== 'ROOT') {
        redirect('/dashboard/settings/users')
    }

    // Only ROOT can edit other ROOTs or ADMINs
    const availableRoles = currentUser.role === 'ROOT'
        ? [{ value: 'ROOT', label: 'Root' }, ...roleOptions]
        : roleOptions

    const updateUserWithId = updateUser.bind(null, id)

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard/settings/users">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <h1 className="text-2xl font-bold tracking-tight">Editar Usuário</h1>
            </div>

            <div className="rounded-md border bg-card p-6 max-w-2xl">
                <form action={updateUserWithId} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nome Completo</Label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="Nome do usuário"
                            defaultValue={userToEdit.name}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                            value={userToEdit.email}
                            disabled
                            className="bg-muted"
                        />
                        <p className="text-xs text-muted-foreground">
                            O email não pode ser alterado
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="role">Perfil de Acesso</Label>
                        <Select name="role" defaultValue={userToEdit.role} required>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione o perfil" />
                            </SelectTrigger>
                            <SelectContent>
                                {availableRoles.map((role) => (
                                    <SelectItem key={role.value} value={role.value}>
                                        {role.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="areaId">Área</Label>
                        <Select name="areaId" defaultValue={userToEdit.areaId || undefined}>
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

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="isActive"
                            name="isActive"
                            value="true"
                            defaultChecked={userToEdit.isActive}
                            className="h-4 w-4"
                        />
                        <Label htmlFor="isActive">Usuário Ativo</Label>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <Button type="submit">Salvar Alterações</Button>
                        <Button type="button" variant="outline" asChild>
                            <Link href="/dashboard/settings/users">Cancelar</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
