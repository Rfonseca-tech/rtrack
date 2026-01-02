import { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { getCurrentUserWithRole } from '@/lib/auth-utils'
import { canManageData } from '@/lib/permissions'
import { prisma } from '@/infrastructure/database/prisma'
import { NewUserForm } from './new-user-form'

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

    // Only ROOT can create other ADMINs and ROOTs
    const availableRoles = user.role === 'ROOT'
        ? [{ value: 'ROOT', label: 'Root' }, ...roleOptions]
        : roleOptions

    const areas = await prisma.area.findMany({
        orderBy: { name: 'asc' }
    })

    return <NewUserForm areas={areas} availableRoles={availableRoles} />
}
