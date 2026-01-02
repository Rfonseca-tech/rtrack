'use server'

import { redirect } from "next/navigation"
import { z } from "zod"
import { prisma } from "@/infrastructure/database/prisma"
import { revalidatePath } from "next/cache"
import { getCurrentUserWithRole } from "@/lib/auth-utils"
import { canManageData } from "@/lib/permissions"
import { createClient } from "@/infrastructure/auth/supabase-server"
import { UserRole } from "@prisma/client"

const userSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    email: z.string().email("Email inválido"),
    role: z.nativeEnum(UserRole),
    areaId: z.string().optional(),
})

export async function createUser(formData: FormData): Promise<void> {
    const currentUser = await getCurrentUserWithRole()

    if (!currentUser || !canManageData(currentUser.role)) {
        throw new Error("Não autorizado.")
    }

    const validatedFields = userSchema.safeParse({
        name: formData.get("name"),
        email: formData.get("email"),
        role: formData.get("role"),
        areaId: formData.get("areaId") || undefined,
    })

    if (!validatedFields.success) {
        throw new Error("Erro na validação dos campos")
    }

    const { name, email, role, areaId } = validatedFields.data

    // Generate temporary password
    const tempPassword = `Temp@${Math.random().toString(36).substring(2, 10)}`

    try {
        // Create user in Supabase Auth
        const supabase = await createClient()
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email,
            password: tempPassword,
            email_confirm: true,
        })

        if (authError) {
            console.error("Supabase Auth Error:", authError)
            throw new Error("Falha ao criar usuário no sistema de autenticação: " + authError.message)
        }

        // Create user in database
        await prisma.user.create({
            data: {
                id: authData.user.id,
                name,
                email,
                role,
                areaId: areaId || null,
            },
        })

        // TODO: Send email with temporary password
        console.log(`Usuário criado: ${email} - Senha temporária: ${tempPassword}`)

    } catch (error) {
        console.error("Database Error:", error)
        // @ts-ignore
        if (error.code === 'P2002') {
            throw new Error("Já existe um usuário com este email.")
        }
        throw error
    }

    revalidatePath('/dashboard/settings/users')
    redirect('/dashboard/settings/users')
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

export async function deleteUser(id: string): Promise<{ success: boolean; message?: string }> {
    const currentUser = await getCurrentUserWithRole()

    if (!currentUser || !canManageData(currentUser.role)) {
        return { success: false, message: "Não autorizado." }
    }

    // Prevent self-deletion
    if (currentUser.id === id) {
        return { success: false, message: "Você não pode excluir seu próprio usuário." }
    }

    try {
        // Soft delete - just deactivate
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
