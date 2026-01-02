'use server'

import { redirect } from "next/navigation"
import { z } from "zod"
import { prisma } from "@/infrastructure/database/prisma"
import { revalidatePath } from "next/cache"
import { getCurrentUserWithRole } from "@/lib/auth-utils"
import { canManageData } from "@/lib/permissions"

const areaSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    description: z.string().optional(),
    externalUrl: z.string().url().optional().or(z.literal('')),
})

export async function createArea(formData: FormData): Promise<void> {
    const user = await getCurrentUserWithRole()

    if (!user || !canManageData(user.role)) {
        throw new Error("Não autorizado.")
    }

    const validatedFields = areaSchema.safeParse({
        name: formData.get("name"),
        description: formData.get("description") || undefined,
        externalUrl: formData.get("externalUrl") || undefined,
    })

    if (!validatedFields.success) {
        throw new Error("Erro na validação dos campos")
    }

    const { name, description, externalUrl } = validatedFields.data

    try {
        await prisma.area.create({
            data: {
                name,
                description,
                externalUrl: externalUrl || null,
            },
        })
    } catch (error) {
        console.error("Database Error:", error)
        // @ts-ignore
        if (error.code === 'P2002') {
            throw new Error("Já existe uma área com este nome.")
        }
        throw new Error("Falha ao criar área.")
    }

    revalidatePath('/dashboard/settings/areas')
    redirect('/dashboard/settings/areas')
}

export async function updateArea(id: string, formData: FormData): Promise<void> {
    const user = await getCurrentUserWithRole()

    if (!user || !canManageData(user.role)) {
        throw new Error("Não autorizado.")
    }

    const validatedFields = areaSchema.safeParse({
        name: formData.get("name"),
        description: formData.get("description") || undefined,
        externalUrl: formData.get("externalUrl") || undefined,
    })

    if (!validatedFields.success) {
        throw new Error("Erro na validação dos campos")
    }

    const { name, description, externalUrl } = validatedFields.data

    try {
        await prisma.area.update({
            where: { id },
            data: {
                name,
                description,
                externalUrl: externalUrl || null,
            },
        })
    } catch (error) {
        console.error("Database Error:", error)
        // @ts-ignore
        if (error.code === 'P2002') {
            throw new Error("Já existe uma área com este nome.")
        }
        throw new Error("Falha ao atualizar área.")
    }

    revalidatePath('/dashboard/settings/areas')
    redirect('/dashboard/settings/areas')
}

export async function deleteArea(id: string): Promise<{ success: boolean; message?: string }> {
    const user = await getCurrentUserWithRole()

    if (!user || !canManageData(user.role)) {
        return { success: false, message: "Não autorizado." }
    }

    try {
        await prisma.area.delete({
            where: { id },
        })
        revalidatePath('/dashboard/settings/areas')
        return { success: true }
    } catch (error) {
        console.error("Database Error:", error)
        return { success: false, message: "Falha ao excluir área. Pode haver usuários ou produtos associados." }
    }
}
