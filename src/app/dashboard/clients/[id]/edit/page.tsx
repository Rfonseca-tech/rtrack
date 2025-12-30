import { Metadata } from 'next'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getCurrentUserWithRole } from '@/lib/auth-utils'
import { canManageData } from '@/lib/permissions'
import { prisma } from '@/infrastructure/database/prisma'
import { updateClient } from '../../actions'

export const metadata: Metadata = {
    title: 'Editar Cliente',
}

export default async function EditClientPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const user = await getCurrentUserWithRole()

    if (!user || !canManageData(user.role)) {
        redirect('/dashboard/clients')
    }

    const client = await prisma.client.findUnique({
        where: { id },
    })

    if (!client) {
        notFound()
    }

    // Create a bound action with the client ID
    const updateClientWithId = updateClient.bind(null, id)

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard/clients">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <h1 className="text-2xl font-bold tracking-tight">Editar Cliente</h1>
            </div>

            <div className="rounded-md border bg-card p-6 max-w-2xl">
                <form action={updateClientWithId} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="razaoSocial">Razão Social</Label>
                        <Input
                            id="razaoSocial"
                            name="razaoSocial"
                            placeholder="Nome da empresa"
                            defaultValue={client.razaoSocial}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="cnpj">CNPJ</Label>
                        <Input
                            id="cnpj"
                            name="cnpj"
                            placeholder="00.000.000/0000-00"
                            defaultValue={client.cnpj}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="emailDomain">Domínio de Email</Label>
                        <Input
                            id="emailDomain"
                            name="emailDomain"
                            placeholder="empresa.com.br"
                            defaultValue={client.emailDomain}
                            required
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="isActive"
                            name="isActive"
                            value="true"
                            defaultChecked={client.isActive}
                            className="h-4 w-4"
                        />
                        <Label htmlFor="isActive">Cliente Ativo</Label>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <Button type="submit">Salvar Alterações</Button>
                        <Button type="button" variant="outline" asChild>
                            <Link href="/dashboard/clients">Cancelar</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
