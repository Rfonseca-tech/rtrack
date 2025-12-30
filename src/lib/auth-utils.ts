'use server'

import { createClient } from "@/infrastructure/auth/supabase-server"
import { prisma } from "@/infrastructure/database/prisma"

export type UserWithRole = {
    id: string
    email: string
    name: string
    role: 'ROOT' | 'ADMIN' | 'EMPLOYEE' | 'CLIENT'
}

/**
 * Obtém o usuário atual com seu role do banco de dados
 */
export async function getCurrentUserWithRole(): Promise<UserWithRole | null> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return null
    }

    try {
        const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: {
                id: true,
                email: true,
                name: true,
                role: true
            }
        })

        if (!dbUser) {
            return null
        }

        return {
            id: dbUser.id,
            email: dbUser.email,
            name: dbUser.name,
            role: dbUser.role as 'ROOT' | 'ADMIN' | 'EMPLOYEE' | 'CLIENT'
        }
    } catch (error) {
        console.error('Error fetching user role:', error)
        return null
    }
}

/**
 * Verifica se o usuário pode editar/criar/excluir dados
 * Apenas ROOT e ADMIN têm permissão
 */
export function canManageData(role: string | undefined): boolean {
    return role === 'ROOT' || role === 'ADMIN'
}

/**
 * Verifica se o usuário pode editar suas próprias configurações de login
 * Apenas ROOT pode editar o próprio login (ADMIN não pode)
 */
export function canEditOwnAuth(role: string | undefined): boolean {
    return role === 'ROOT'
}
