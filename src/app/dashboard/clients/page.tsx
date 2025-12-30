import { Metadata } from 'next'
import { Plus, Users } from 'lucide-react'
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

export const metadata: Metadata = {
    title: 'Clientes',
}

export default async function ClientsPage() {
    const clients = await prisma.client.findMany({
        include: {
            _count: {
                select: { projects: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    })

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Clientes</h1>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Novo Cliente
                </Button>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Razão Social</TableHead>
                            <TableHead>CNPJ</TableHead>
                            <TableHead>Domínio Email</TableHead>
                            <TableHead>Projetos</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {clients.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
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
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
