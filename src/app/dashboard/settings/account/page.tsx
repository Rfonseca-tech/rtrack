import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { User, KeyRound } from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getCurrentUserWithRole } from '@/lib/auth-utils'
import { prisma } from '@/infrastructure/database/prisma'
import { ChangePasswordForm } from './change-password-form'

export const metadata: Metadata = {
    title: 'Minha Conta',
}

const roleLabels: Record<string, string> = {
    ROOT: 'Root',
    ADMIN: 'Administrador',
    EMPLOYEE: 'Funcionário',
    CLIENT: 'Cliente',
}

export default async function AccountPage() {
    const authUser = await getCurrentUserWithRole()

    if (!authUser) {
        redirect('/login')
    }

    const user = await prisma.user.findUnique({
        where: { id: authUser.id },
        include: {
            area: { select: { name: true } }
        }
    })

    if (!user) {
        redirect('/login')
    }

    return (
        <div className="flex flex-col gap-6 max-w-2xl">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Minha Conta</h1>
                <p className="text-muted-foreground">
                    Gerencie suas informações e segurança
                </p>
            </div>

            {/* User Info Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Informações Pessoais
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Nome</p>
                            <p className="font-medium">{user.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Email</p>
                            <p className="font-medium">{user.email}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Perfil</p>
                            <Badge variant="secondary">{roleLabels[user.role]}</Badge>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Área</p>
                            <p className="font-medium">{user.area?.name || '-'}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Change Password Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <KeyRound className="h-5 w-5" />
                        Alterar Senha
                    </CardTitle>
                    <CardDescription>
                        Atualize sua senha de acesso ao sistema
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ChangePasswordForm />
                </CardContent>
            </Card>
        </div>
    )
}
