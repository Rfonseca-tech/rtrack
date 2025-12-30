'use server'

import { redirect } from "next/navigation"
import { z } from "zod"
import { prisma } from "@/infrastructure/database/prisma"
import { revalidatePath } from "next/cache"
import { getCurrentUserWithRole } from "@/lib/auth-utils"
import { canManageData } from "@/lib/permissions"

const clientSchema = z.object({
    razaoSocial: z.string().min(1, "Razão Social é obrigatória"),
    cnpj: z.string().min(14, "CNPJ deve ter 14 dígitos").max(18, "CNPJ inválido"),
    emailDomain: z.string().min(1, "Domínio de email é obrigatório"),
    isActive: z.boolean().optional().default(true),
})

export async function createClient(formData: FormData): Promise<void> {
    const user = await getCurrentUserWithRole()

    if (!user || !canManageData(user.role)) {
        throw new Error("Não autorizado. Apenas ROOT e ADMIN podem criar clientes.")
    }

    const validatedFields = clientSchema.safeParse({
        razaoSocial: formData.get("razaoSocial"),
        cnpj: formData.get("cnpj")?.toString().replace(/\D/g, ''),
        emailDomain: formData.get("emailDomain"),
        isActive: formData.get("isActive") === "true",
    })

    if (!validatedFields.success) {
        throw new Error("Erro na validação dos campos")
    }

    const { razaoSocial, cnpj, emailDomain, isActive } = validatedFields.data

    try {
        await prisma.client.create({
            data: {
                razaoSocial,
                cnpj,
                emailDomain,
                isActive,
            },
        })
    } catch (error) {
        console.error("Database Error:", error)
        // @ts-ignore
        if (error.code === 'P2002') {
            throw new Error("Já existe um cliente com este CNPJ.")
        }
        throw new Error("Falha ao criar cliente. Tente novamente.")
    }

    revalidatePath('/dashboard/clients')
    redirect('/dashboard/clients')
}

export async function updateClient(id: string, formData: FormData): Promise<void> {
    const user = await getCurrentUserWithRole()

    if (!user || !canManageData(user.role)) {
        throw new Error("Não autorizado. Apenas ROOT e ADMIN podem editar clientes.")
    }

    const validatedFields = clientSchema.safeParse({
        razaoSocial: formData.get("razaoSocial"),
        cnpj: formData.get("cnpj")?.toString().replace(/\D/g, ''),
        emailDomain: formData.get("emailDomain"),
        isActive: formData.get("isActive") === "true",
    })

    if (!validatedFields.success) {
        throw new Error("Erro na validação dos campos")
    }

    const { razaoSocial, cnpj, emailDomain, isActive } = validatedFields.data

    try {
        await prisma.client.update({
            where: { id },
            data: {
                razaoSocial,
                cnpj,
                emailDomain,
                isActive,
            },
        })
    } catch (error) {
        console.error("Database Error:", error)
        // @ts-ignore
        if (error.code === 'P2002') {
            throw new Error("Já existe um cliente com este CNPJ.")
        }
        throw new Error("Falha ao atualizar cliente. Tente novamente.")
    }

    revalidatePath('/dashboard/clients')
    redirect('/dashboard/clients')
}

export async function deleteClient(id: string): Promise<{ success: boolean; message?: string }> {
    const user = await getCurrentUserWithRole()

    if (!user || !canManageData(user.role)) {
        return { success: false, message: "Não autorizado. Apenas ROOT e ADMIN podem excluir clientes." }
    }

    try {
        await prisma.client.delete({
            where: { id },
        })
        revalidatePath('/dashboard/clients')
        return { success: true }
    } catch (error) {
        console.error("Database Error:", error)
        return { success: false, message: "Falha ao excluir cliente. Pode haver projetos associados." }
    }
}
