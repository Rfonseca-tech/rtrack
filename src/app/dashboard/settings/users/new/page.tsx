import { Metadata } from 'next'
import { redirect } from 'next/navigation'
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
import { createUser } from '../actions'

export const metadata: Metadata = {
    title: 'Novo Usuário',
}

const roleOptions = [
    { value: 'ADMIN', label: 'Administrador' },
    { value: 'EMPLOYEE', label: 'Funcionário' },
    { value: 'CLIENT', label: 'Cliente' },
]

export default async function NewUserPage() {
    const user = await getCurrentUserWithRole()

    if (!user || !canManageData(user.role)) {
        redirect('/dashboard/settings/users')
    }

    // Only ROOT can create other ADMINs
    const availableRoles = user.role === 'ROOT'
        ? [{ value: 'ROOT', label: 'Root' }, ...roleOptions]
        : roleOptions

    const areas = await prisma.area.findMany({
        orderBy: { name: 'asc' }
    })

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard/settings/users">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <h1 className="text-2xl font-bold tracking-tight">Novo Usuário</h1>
            </div>

            <div className="rounded-md border bg-card p-6 max-w-2xl">
                <form action={createUser} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nome Completo</Label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="Nome do usuário"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="usuario@email.com"
                            required
                        />
                        <p className="text-xs text-muted-foreground">
                            Uma senha temporária será gerada automaticamente
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="role">Perfil de Acesso</Label>
                        <Select name="role" defaultValue="EMPLOYEE" required>
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
                        <Select name="areaId">
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

                    <div className="flex gap-4 pt-4">
                        <Button type="submit">Criar Usuário</Button>
                        <Button type="button" variant="outline" asChild>
                            <Link href="/dashboard/settings/users">Cancelar</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
