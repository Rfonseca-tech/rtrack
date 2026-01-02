'use server'

import { redirect } from "next/navigation"
import { z } from "zod"
import { prisma } from "@/infrastructure/database/prisma"
import { revalidatePath } from "next/cache"
import { getCurrentUserWithRole } from "@/lib/auth-utils"
import { canManageData, canCreateProject } from "@/lib/permissions"

const projectSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    clientId: z.string().min(1, "Cliente é obrigatório"),
    familyCode: z.string().min(1, "Família de Produto é obrigatória"),
})

export async function createProject(formData: FormData): Promise<void> {
    const user = await getCurrentUserWithRole()

    if (!user || !canCreateProject(user.role)) {
        throw new Error("Não autorizado. Você não tem permissão para criar projetos.")
    }

    const validatedFields = projectSchema.safeParse({
        name: formData.get("name"),
        clientId: formData.get("clientId"),
        familyCode: formData.get("familyCode"),
    })

    if (!validatedFields.success) {
        throw new Error("Erro na validação dos campos")
    }

    const { name, clientId, familyCode } = validatedFields.data

    try {
        await prisma.project.create({
            data: {
                name,
                clientId,
                familyCode,
                // Automatically add the creator as a collaborator
                collaborators: {
                    create: {
                        userId: user.id
                    }
                }
            },
        })
    } catch (error) {
        console.error("Database Error:", error)
        // @ts-ignore
        if (error.code === 'P2002') {
            throw new Error("Já existe um projeto para este cliente com esta Família de Produtos.")
        }
        throw new Error("Falha ao criar projeto. Tente novamente.")
    }

    revalidatePath('/dashboard/projects')
    redirect('/dashboard/projects')
}

export async function updateProject(id: string, formData: FormData): Promise<void> {
    const user = await getCurrentUserWithRole()

    if (!user || !canManageData(user.role)) {
        throw new Error("Não autorizado. Apenas ROOT e ADMIN podem editar projetos.")
    }

    const validatedFields = projectSchema.safeParse({
        name: formData.get("name"),
        clientId: formData.get("clientId"),
        familyCode: formData.get("familyCode"),
    })

    if (!validatedFields.success) {
        throw new Error("Erro na validação dos campos")
    }

    const { name, clientId, familyCode } = validatedFields.data

    try {
        await prisma.project.update({
            where: { id },
            data: {
                name,
                clientId,
                familyCode,
            },
        })
    } catch (error) {
        console.error("Database Error:", error)
        // @ts-ignore  
        if (error.code === 'P2002') {
            throw new Error("Já existe um projeto para este cliente com esta Família de Produtos.")
        }
        throw new Error("Falha ao atualizar projeto. Tente novamente.")
    }

    revalidatePath('/dashboard/projects')
    redirect('/dashboard/projects')
}

export async function deleteProject(id: string): Promise<{ success: boolean; message?: string }> {
    const user = await getCurrentUserWithRole()

    if (!user || !canManageData(user.role)) {
        return { success: false, message: "Não autorizado. Apenas ROOT e ADMIN podem excluir projetos." }
    }

    try {
        await prisma.project.delete({
            where: { id },
        })
        revalidatePath('/dashboard/projects')
        return { success: true }
    } catch (error) {
        console.error("Database Error:", error)
        return { success: false, message: "Falha ao excluir projeto." }
    }
}
