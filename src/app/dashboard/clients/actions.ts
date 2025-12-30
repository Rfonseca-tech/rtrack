'use server'

import { redirect } from "next/navigation"
import { z } from "zod"
import { prisma } from "@/infrastructure/database/prisma"
import { revalidatePath } from "next/cache"
import { getCurrentUserWithRole, canManageData } from "@/lib/auth-utils"

const clientSchema = z.object({
    razaoSocial: z.string().min(1, "Razão Social é obrigatória"),
    cnpj: z.string().min(14, "CNPJ deve ter 14 dígitos").max(18, "CNPJ inválido"),
    emailDomain: z.string().min(1, "Domínio de email é obrigatório"),
    isActive: z.boolean().optional().default(true),
})

export type ClientActionState = {
    errors?: {
        razaoSocial?: string[]
        cnpj?: string[]
        emailDomain?: string[]
        _form?: string[]
    }
    message?: string | null
    success?: boolean
}

export async function createClient(prevState: ClientActionState, formData: FormData): Promise<ClientActionState> {
    const user = await getCurrentUserWithRole()

    if (!user || !canManageData(user.role)) {
        return { message: "Não autorizado. Apenas ROOT e ADMIN podem criar clientes." }
    }

    const validatedFields = clientSchema.safeParse({
        razaoSocial: formData.get("razaoSocial"),
        cnpj: formData.get("cnpj")?.toString().replace(/\D/g, ''),
        emailDomain: formData.get("emailDomain"),
        isActive: formData.get("isActive") === "true",
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Erro na validação dos campos",
        }
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
            return { message: "Já existe um cliente com este CNPJ." }
        }
        return { message: "Falha ao criar cliente. Tente novamente." }
    }

    revalidatePath('/dashboard/clients')
    redirect('/dashboard/clients')
}

export async function updateClient(id: string, prevState: ClientActionState, formData: FormData): Promise<ClientActionState> {
    const user = await getCurrentUserWithRole()

    if (!user || !canManageData(user.role)) {
        return { message: "Não autorizado. Apenas ROOT e ADMIN podem editar clientes." }
    }

    const validatedFields = clientSchema.safeParse({
        razaoSocial: formData.get("razaoSocial"),
        cnpj: formData.get("cnpj")?.toString().replace(/\D/g, ''),
        emailDomain: formData.get("emailDomain"),
        isActive: formData.get("isActive") === "true",
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Erro na validação dos campos",
        }
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
            return { message: "Já existe um cliente com este CNPJ." }
        }
        return { message: "Falha ao atualizar cliente. Tente novamente." }
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
