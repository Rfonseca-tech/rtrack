'use server'

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getCurrentUserWithRole } from "@/lib/auth-utils"
import { canManageData } from "@/lib/permissions"
import { prisma } from "@/infrastructure/database/prisma"

const familySchema = z.object({
    code: z.string().min(1, "Código é obrigatório").max(20, "Código muito longo"),
    name: z.string().min(1, "Nome é obrigatório").max(100, "Nome muito longo"),
    description: z.string().optional(),
    areaId: z.string().optional(),
})

export async function createFamily(formData: FormData) {
    const user = await getCurrentUserWithRole()

    if (!user || !canManageData(user.role)) {
        throw new Error("Sem permissão.")
    }

    const validatedFields = familySchema.safeParse({
        code: formData.get("code"),
        name: formData.get("name"),
        description: formData.get("description") || undefined,
        areaId: formData.get("areaId") || undefined,
    })

    if (!validatedFields.success) {
        throw new Error(validatedFields.error.issues[0].message)
    }

    const { code, name, description, areaId } = validatedFields.data

    try {
        await prisma.productFamily.create({
            data: {
                code,
                name,
                description: description || null,
                areaId: areaId || null,
            },
        })
    } catch (error: unknown) {
        console.error("Error creating family:", error)
        if (error instanceof Error && error.message.includes("Unique constraint")) {
            throw new Error("Código já existe.")
        }
        throw new Error("Erro ao criar família.")
    }

    revalidatePath("/dashboard/settings/families")
    redirect("/dashboard/settings/families")
}

export async function updateFamily(id: string, formData: FormData) {
    const user = await getCurrentUserWithRole()

    if (!user || !canManageData(user.role)) {
        throw new Error("Sem permissão.")
    }

    const validatedFields = familySchema.safeParse({
        code: formData.get("code"),
        name: formData.get("name"),
        description: formData.get("description") || undefined,
        areaId: formData.get("areaId") || undefined,
    })

    if (!validatedFields.success) {
        throw new Error(validatedFields.error.issues[0].message)
    }

    const { code, name, description, areaId } = validatedFields.data

    try {
        await prisma.productFamily.update({
            where: { id },
            data: {
                code,
                name,
                description: description || null,
                areaId: areaId || null,
            },
        })
    } catch (error) {
        console.error("Error updating family:", error)
        throw new Error("Erro ao atualizar família.")
    }

    revalidatePath("/dashboard/settings/families")
    redirect("/dashboard/settings/families")
}

export async function deleteFamily(id: string) {
    const user = await getCurrentUserWithRole()

    if (!user || !canManageData(user.role)) {
        return { success: false, message: "Sem permissão." }
    }

    try {
        // Check if family has products
        const productsCount = await prisma.product.count({
            where: { familyId: id },
        })

        if (productsCount > 0) {
            return { success: false, message: `Não é possível excluir. Existem ${productsCount} produto(s) vinculado(s).` }
        }

        await prisma.productFamily.delete({
            where: { id },
        })
    } catch (error) {
        console.error("Error deleting family:", error)
        return { success: false, message: "Erro ao excluir família." }
    }

    revalidatePath("/dashboard/settings/families")
    return { success: true }
}
