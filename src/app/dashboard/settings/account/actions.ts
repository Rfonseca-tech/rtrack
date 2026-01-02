'use server'

import { z } from "zod"
import { getCurrentUserWithRole } from "@/lib/auth-utils"
import { createAdminClient } from "@/infrastructure/auth/supabase-server"

const passwordSchema = z.object({
    currentPassword: z.string().min(1, "Senha atual é obrigatória"),
    newPassword: z.string().min(8, "Nova senha deve ter pelo menos 8 caracteres"),
    confirmPassword: z.string().min(1, "Confirmação é obrigatória"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
})

export type ChangePasswordResult = {
    success: boolean
    error?: string
}

export async function changeOwnPassword(formData: FormData): Promise<ChangePasswordResult> {
    const user = await getCurrentUserWithRole()

    if (!user) {
        return { success: false, error: "Não autenticado." }
    }

    const validatedFields = passwordSchema.safeParse({
        currentPassword: formData.get("currentPassword"),
        newPassword: formData.get("newPassword"),
        confirmPassword: formData.get("confirmPassword"),
    })

    if (!validatedFields.success) {
        const firstError = validatedFields.error.issues[0]
        return { success: false, error: firstError.message }
    }

    const { newPassword } = validatedFields.data

    try {
        const supabase = createAdminClient()

        // Update password using admin API
        const { error } = await supabase.auth.admin.updateUserById(user.id, {
            password: newPassword,
        })

        if (error) {
            console.error("Supabase Auth Error:", error)
            return { success: false, error: "Falha ao alterar senha: " + error.message }
        }

        return { success: true }
    } catch (error) {
        console.error("Error changing password:", error)
        return { success: false, error: "Erro ao alterar senha." }
    }
}
