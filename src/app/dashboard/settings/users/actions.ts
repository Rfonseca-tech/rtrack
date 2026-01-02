'use server'

import { redirect } from "next/navigation"
import { z } from "zod"
import { prisma } from "@/infrastructure/database/prisma"
import { revalidatePath } from "next/cache"
import { getCurrentUserWithRole } from "@/lib/auth-utils"
import { canManageData, canEditOwnAuth } from "@/lib/permissions"
import { createAdminClient } from "@/infrastructure/auth/supabase-server"
import { UserRole } from "@prisma/client"
import { cookies } from "next/headers"

const userSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    email: z.string().email("Email inválido"),
    role: z.nativeEnum(UserRole),
    areaId: z.string().optional(),
})

// Return type that includes the temp password to show to admin
export type CreateUserResult = {
    success: boolean
    tempPassword?: string
    userId?: string
    error?: string
}

export async function createUserWithPassword(formData: FormData): Promise<CreateUserResult> {
    const currentUser = await getCurrentUserWithRole()

    if (!currentUser || !canManageData(currentUser.role)) {
        return { success: false, error: "Não autorizado." }
    }

    const validatedFields = userSchema.safeParse({
        name: formData.get("name"),
        email: formData.get("email"),
        role: formData.get("role"),
        areaId: formData.get("areaId") || undefined,
    })

    if (!validatedFields.success) {
        return { success: false, error: "Erro na validação dos campos" }
    }

    const { name, email, role, areaId } = validatedFields.data

    // Generate temporary password
    const tempPassword = `Temp@${Math.random().toString(36).substring(2, 10)}`

    try {
        const supabase = createAdminClient()
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email,
            password: tempPassword,
            email_confirm: true,
        })

        if (authError) {
            console.error("Supabase Auth Error:", authError)
            return { success: false, error: "Falha ao criar usuário: " + authError.message }
        }

        await prisma.user.create({
            data: {
                id: authData.user.id,
                name,
                email,
                role,
                areaId: areaId || null,
            },
        })

        revalidatePath('/dashboard/settings/users')

        return {
            success: true,
            tempPassword,
            userId: authData.user.id
        }

    } catch (error) {
        console.error("Database Error:", error)
        // @ts-ignore
        if (error.code === 'P2002') {
            return { success: false, error: "Já existe um usuário com este email." }
        }
        return { success: false, error: "Falha ao criar usuário." }
    }
}

// Reset password - generates new temp password
export async function resetUserPassword(userId: string): Promise<{ success: boolean; newPassword?: string; error?: string }> {
    const currentUser = await getCurrentUserWithRole()

    // Only ROOT can reset passwords
    if (!currentUser || !canEditOwnAuth(currentUser.role)) {
        return { success: false, error: "Apenas ROOT pode redefinir senhas." }
    }

    // Generate new temporary password
    const newPassword = `Temp@${Math.random().toString(36).substring(2, 10)}`

    try {
        const supabase = createAdminClient()
        const { error } = await supabase.auth.admin.updateUserById(userId, {
            password: newPassword,
        })

        if (error) {
            console.error("Supabase Auth Error:", error)
            return { success: false, error: "Falha ao redefinir senha: " + error.message }
        }

        return { success: true, newPassword }
    } catch (error) {
        console.error("Error resetting password:", error)
        return { success: false, error: "Erro ao redefinir senha." }
    }
}

// Hard delete user - removes from auth and database
export async function hardDeleteUser(userId: string): Promise<{ success: boolean; error?: string }> {
    const currentUser = await getCurrentUserWithRole()

    // Only ROOT can hard delete
    if (!currentUser || !canEditOwnAuth(currentUser.role)) {
        return { success: false, error: "Apenas ROOT pode excluir permanentemente." }
    }

    if (currentUser.id === userId) {
        return { success: false, error: "Você não pode excluir seu próprio usuário." }
    }

    try {
        // Delete from Supabase Auth
        const supabase = createAdminClient()
        const { error: authError } = await supabase.auth.admin.deleteUser(userId)

        if (authError) {
            console.error("Supabase Auth Error:", authError)
            return { success: false, error: "Falha ao excluir do Auth: " + authError.message }
        }

        // Delete from database
        await prisma.user.delete({
            where: { id: userId },
        })

        revalidatePath('/dashboard/settings/users')
        return { success: true }
    } catch (error) {
        console.error("Error deleting user:", error)
        return { success: false, error: "Erro ao excluir usuário." }
    }
}

export async function updateUser(id: string, formData: FormData): Promise<void> {
    const currentUser = await getCurrentUserWithRole()

    if (!currentUser || !canManageData(currentUser.role)) {
        throw new Error("Não autorizado.")
    }

    const validatedFields = z.object({
        name: z.string().min(1, "Nome é obrigatório"),
        role: z.nativeEnum(UserRole),
        areaId: z.string().optional(),
        isActive: z.boolean(),
    }).safeParse({
        name: formData.get("name"),
        role: formData.get("role"),
        areaId: formData.get("areaId") || undefined,
        isActive: formData.get("isActive") === "true",
    })

    if (!validatedFields.success) {
        throw new Error("Erro na validação dos campos")
    }

    const { name, role, areaId, isActive } = validatedFields.data

    try {
        await prisma.user.update({
            where: { id },
            data: {
                name,
                role,
                areaId: areaId || null,
                isActive,
            },
        })
    } catch (error) {
        console.error("Database Error:", error)
        throw new Error("Falha ao atualizar usuário.")
    }

    revalidatePath('/dashboard/settings/users')
    redirect('/dashboard/settings/users')
}

// Soft delete (deactivate)
export async function deactivateUser(id: string): Promise<{ success: boolean; message?: string }> {
    const currentUser = await getCurrentUserWithRole()

    if (!currentUser || !canManageData(currentUser.role)) {
        return { success: false, message: "Não autorizado." }
    }

    if (currentUser.id === id) {
        return { success: false, message: "Você não pode desativar seu próprio usuário." }
    }

    try {
        await prisma.user.update({
            where: { id },
            data: { isActive: false },
        })
        revalidatePath('/dashboard/settings/users')
        return { success: true }
    } catch (error) {
        console.error("Database Error:", error)
        return { success: false, message: "Falha ao desativar usuário." }
    }
}
