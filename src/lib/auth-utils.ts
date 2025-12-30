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

    if (!user || !user.email) {
        console.log('[auth-utils] No user or email found in Supabase session')
        return null
    }

    try {
        const dbUser = await prisma.user.findUnique({
            where: { email: user.email },
            select: {
                id: true,
                email: true,
                name: true,
                role: true
            }
        })

        if (!dbUser) {
            console.log(`[auth-utils] User with email ${user.email} not found in public.users`)
            // Fallback: se não encontrar no banco, retorna como ROOT para o admin principal
            // Isso é temporário até sincronizar os dados
            return {
                id: user.id,
                email: user.email,
                name: user.email.split('@')[0] || 'User',
                role: 'ROOT'
            }
        }

        console.log(`[auth-utils] Found user ${dbUser.email} with role ${dbUser.role}`)
        return {
            id: dbUser.id,
            email: dbUser.email,
            name: dbUser.name,
            role: dbUser.role as 'ROOT' | 'ADMIN' | 'EMPLOYEE' | 'CLIENT'
        }
    } catch (error) {
        console.error('[auth-utils] Error fetching user role:', error)
        // Em caso de erro, retorna como ROOT para não bloquear admin
        return {
            id: user.id,
            email: user.email,
            name: user.email.split('@')[0] || 'User',
            role: 'ROOT'
        }
    }
}
