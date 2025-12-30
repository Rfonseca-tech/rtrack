import { Metadata } from 'next'
import { Plus, Users, Pencil, Trash2 } from 'lucide-react'
import Link from 'next/link'
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
import { DeleteClientButton } from './delete-button'

export const metadata: Metadata = {
    title: 'Clientes',
}

type ClientWithCount = {
    id: string
    razaoSocial: string
    cnpj: string
    emailDomain: string
    isActive: boolean
    _count: {
        projects: number
    }
}

export default async function ClientsPage() {
    let clients: ClientWithCount[] = []
    let error: string | null = null
    let userRole: string | null = null

    try {
        const user = await getCurrentUserWithRole()
        userRole = user?.role || null

        clients = await prisma.client.findMany({
            include: {
                _count: {
                    select: { projects: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        }) as ClientWithCount[]
    } catch (e) {
        console.error('Error fetching clients:', e)
        error = 'Erro ao carregar clientes. Verifique a conexão com o banco de dados.'
    }

    const canEdit = canManageData(userRole || undefined)

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Clientes</h1>
                {canEdit && (
                    <Button asChild>
                        <Link href="/dashboard/clients/new">
                            <Plus className="mr-2 h-4 w-4" /> Novo Cliente
                        </Link>
                    </Button>
                )}
            </div>

            <div className="rounded-md border bg-card">
                {error ? (
                    <div className="p-8 text-center text-red-500">
                        <p>{error}</p>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Razão Social</TableHead>
                                <TableHead>CNPJ</TableHead>
                                <TableHead>Domínio Email</TableHead>
                                <TableHead>Projetos</TableHead>
                                <TableHead>Status</TableHead>
                                {canEdit && <TableHead className="text-right">Ações</TableHead>}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {clients.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={canEdit ? 6 : 5} className="h-24 text-center text-muted-foreground">
                                        <div className="flex flex-col items-center gap-2">
                                            <Users className="h-8 w-8" />
                                            <span>Nenhum cliente cadastrado.</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                clients.map((client) => (
                                    <TableRow key={client.id}>
                                        <TableCell className="font-medium">{client.razaoSocial}</TableCell>
                                        <TableCell>{client.cnpj}</TableCell>
                                        <TableCell>{client.emailDomain}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">{client._count.projects}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={client.isActive ? "default" : "destructive"}>
                                                {client.isActive ? "Ativo" : "Inativo"}
                                            </Badge>
                                        </TableCell>
                                        {canEdit && (
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" asChild>
                                                        <Link href={`/dashboard/clients/${client.id}/edit`}>
                                                            <Pencil className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <DeleteClientButton clientId={client.id} clientName={client.razaoSocial} />
                                                </div>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                )}
            </div>
        </div>
    )
}
