'use server'

import { redirect } from "next/navigation"
import { z } from "zod"
import { prisma } from "@/infrastructure/database/prisma"
import { createClient } from "@/infrastructure/auth/supabase-server"
import { revalidatePath } from "next/cache"

const projectSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    clientId: z.string().min(1, "Cliente é obrigatório"),
    familyCode: z.string().min(1, "Família de Produto é obrigatória"),
})

export type CreateProjectState = {
    errors?: {
        name?: string[]
        clientId?: string[]
        familyCode?: string[]
        _form?: string[]
    }
    message?: string | null
}

export async function createProject(prevState: CreateProjectState, formData: FormData): Promise<CreateProjectState> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { message: "Não autorizado" }
    }

    const validatedFields = projectSchema.safeParse({
        name: formData.get("name"),
        clientId: formData.get("clientId"),
        familyCode: formData.get("familyCode"),
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Erro na validação dos campos",
        }
    }

    const { name, clientId, familyCode } = validatedFields.data

    try {
        await prisma.project.create({
            data: {
                name,
                clientId,
                familyCode,
            },
        })
    } catch (error) {
        console.error("Database Error:", error)
        // Check for unique constraint violation (P2002)
        // @ts-ignore
        if (error.code === 'P2002') {
            return {
                message: "Já existe um projeto para este cliente com esta Família de Produtos."
            }
        }
        return {
            message: "Falha ao criar projeto. Tente novamente.",
        }
    }

    revalidatePath('/dashboard/projects')
    redirect('/dashboard/projects')
}
