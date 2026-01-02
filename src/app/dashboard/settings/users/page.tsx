import { Metadata } from 'next'
import Link from 'next/link'
import { Plus, Pencil } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
import { canManageData, canEditOwnAuth } from '@/lib/permissions'
import { UserActions } from './user-actions'

export const metadata: Metadata = {
    title: 'Usuários',
}

const roleLabels: Record<string, string> = {
    ROOT: 'Root',
    ADMIN: 'Administrador',
    EMPLOYEE: 'Funcionário',
    CLIENT: 'Cliente',
}

const roleBadgeVariants: Record<string, string> = {
    ROOT: 'bg-purple-100 text-purple-800',
    ADMIN: 'bg-blue-100 text-blue-800',
    EMPLOYEE: 'bg-green-100 text-green-800',
    CLIENT: 'bg-gray-100 text-gray-800',
}

type UserWithArea = {
    id: string
    name: string
    email: string
    role: string
    isActive: boolean
    area: { name: string } | null
}

export default async function UsersPage() {
    const user = await getCurrentUserWithRole()
    const userRole = user?.role

    let users: UserWithArea[] = []
    let error: string | null = null

    try {
        users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isActive: true,
                area: {
                    select: { name: true }
                }
            },
            orderBy: [
                { isActive: 'desc' },
                { name: 'asc' }
            ],
        })
    } catch (e) {
        console.error('Error fetching users:', e)
        error = 'Erro ao carregar usuários.'
    }

    const canEdit = canManageData(userRole || undefined)
    const isRoot = canEditOwnAuth(userRole || undefined)

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Usuários</h1>
                    <p className="text-muted-foreground">Gerencie os usuários do sistema</p>
                </div>
                {canEdit && (
                    <Button asChild>
                        <Link href="/dashboard/settings/users/new">
                            <Plus className="mr-2 h-4 w-4" />
                            Novo Usuário
                        </Link>
                    </Button>
                )}
            </div>

            {error ? (
                <div className="rounded-md border bg-destructive/10 p-4 text-destructive">
                    {error}
                </div>
            ) : users.length === 0 ? (
                <div className="rounded-md border bg-card p-8">
                    <div className="flex flex-col items-center justify-center gap-4 text-center">
                        <h2 className="text-lg font-semibold">Nenhum usuário cadastrado</h2>
                        <p className="text-sm text-muted-foreground max-w-md">
                            Crie usuários para dar acesso ao sistema.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Área</TableHead>
                                <TableHead>Perfil</TableHead>
                                <TableHead>Status</TableHead>
                                {canEdit && <TableHead className="w-[150px]">Ações</TableHead>}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((u) => (
                                <TableRow key={u.id} className={!u.isActive ? 'opacity-50' : ''}>
                                    <TableCell className="font-medium">{u.name}</TableCell>
                                    <TableCell>{u.email}</TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {u.area?.name || '-'}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className={roleBadgeVariants[u.role]}>
                                            {roleLabels[u.role]}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={u.isActive ? 'default' : 'secondary'}>
                                            {u.isActive ? 'Ativo' : 'Inativo'}
                                        </Badge>
                                    </TableCell>
                                    {canEdit && u.id !== user?.id && (isRoot || u.role !== 'ROOT') && (
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Button variant="ghost" size="icon" asChild className="h-8 w-8">
                                                    <Link href={`/dashboard/settings/users/${u.id}/edit`}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <UserActions
                                                    userId={u.id}
                                                    userName={u.name}
                                                    isRoot={isRoot}
                                                />
                                            </div>
                                        </TableCell>
                                    )}
                                    {canEdit && u.id !== user?.id && !isRoot && u.role === 'ROOT' && (
                                        <TableCell>
                                            <span className="text-xs text-muted-foreground">Protegido</span>
                                        </TableCell>
                                    )}
                                    {canEdit && u.id === user?.id && (
                                        <TableCell>
                                            <span className="text-xs text-muted-foreground">Você</span>
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
