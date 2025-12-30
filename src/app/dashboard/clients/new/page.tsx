import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getCurrentUserWithRole, canManageData } from '@/lib/auth-utils'
import { createClient } from '../actions'

export const metadata: Metadata = {
    title: 'Novo Cliente',
}

export default async function NewClientPage() {
    const user = await getCurrentUserWithRole()

    if (!user || !canManageData(user.role)) {
        redirect('/dashboard/clients')
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard/clients">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <h1 className="text-2xl font-bold tracking-tight">Novo Cliente</h1>
            </div>

            <div className="rounded-md border bg-card p-6 max-w-2xl">
                <ClientForm action={createClient} />
            </div>
        </div>
    )
}

function ClientForm({ action }: { action: typeof createClient }) {
    return (
        <form action={action} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="razaoSocial">Razão Social</Label>
                <Input
                    id="razaoSocial"
                    name="razaoSocial"
                    placeholder="Nome da empresa"
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ</Label>
                <Input
                    id="cnpj"
                    name="cnpj"
                    placeholder="00.000.000/0000-00"
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="emailDomain">Domínio de Email</Label>
                <Input
                    id="emailDomain"
                    name="emailDomain"
                    placeholder="empresa.com.br"
                    required
                />
            </div>

            <input type="hidden" name="isActive" value="true" />

            <div className="flex gap-4 pt-4">
                <Button type="submit">Criar Cliente</Button>
                <Button type="button" variant="outline" asChild>
                    <Link href="/dashboard/clients">Cancelar</Link>
                </Button>
            </div>
        </form>
    )
}
