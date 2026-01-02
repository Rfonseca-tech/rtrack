'use server'

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getCurrentUserWithRole } from "@/lib/auth-utils"
import { canManageData } from "@/lib/permissions"
import { prisma } from "@/infrastructure/database/prisma"

const productSchema = z.object({
    code: z.string().min(1, "Código é obrigatório").max(20, "Código muito longo"),
    name: z.string().min(1, "Nome é obrigatório").max(100, "Nome muito longo"),
    description: z.string().optional(),
    familyId: z.string().min(1, "Família é obrigatória"),
})

export async function createProduct(formData: FormData) {
    const user = await getCurrentUserWithRole()

    if (!user || !canManageData(user.role)) {
        throw new Error("Sem permissão.")
    }

    const validatedFields = productSchema.safeParse({
        code: formData.get("code"),
        name: formData.get("name"),
        description: formData.get("description") || undefined,
        familyId: formData.get("familyId"),
    })

    if (!validatedFields.success) {
        throw new Error(validatedFields.error.issues[0].message)
    }

    const { code, name, description, familyId } = validatedFields.data

    try {
        await prisma.product.create({
            data: {
                code,
                name,
                description: description || null,
                familyId,
            },
        })
    } catch (error: unknown) {
        console.error("Error creating product:", error)
        if (error instanceof Error && error.message.includes("Unique constraint")) {
            throw new Error("Código já existe.")
        }
        throw new Error("Erro ao criar produto.")
    }

    revalidatePath("/dashboard/settings/products")
    redirect("/dashboard/settings/products")
}

export async function updateProduct(id: string, formData: FormData) {
    const user = await getCurrentUserWithRole()

    if (!user || !canManageData(user.role)) {
        throw new Error("Sem permissão.")
    }

    const validatedFields = productSchema.safeParse({
        code: formData.get("code"),
        name: formData.get("name"),
        description: formData.get("description") || undefined,
        familyId: formData.get("familyId"),
    })

    if (!validatedFields.success) {
        throw new Error(validatedFields.error.issues[0].message)
    }

    const { code, name, description, familyId } = validatedFields.data

    try {
        await prisma.product.update({
            where: { id },
            data: {
                code,
                name,
                description: description || null,
                familyId,
            },
        })
    } catch (error) {
        console.error("Error updating product:", error)
        throw new Error("Erro ao atualizar produto.")
    }

    revalidatePath("/dashboard/settings/products")
    redirect("/dashboard/settings/products")
}

export async function deleteProduct(id: string) {
    const user = await getCurrentUserWithRole()

    if (!user || !canManageData(user.role)) {
        return { success: false, message: "Sem permissão." }
    }

    try {
        // Check if product has templates
        const templatesCount = await prisma.taskTemplate.count({
            where: { productId: id },
        })

        if (templatesCount > 0) {
            return { success: false, message: `Não é possível excluir. Existem ${templatesCount} template(s) vinculado(s).` }
        }

        await prisma.product.delete({
            where: { id },
        })
    } catch (error) {
        console.error("Error deleting product:", error)
        return { success: false, message: "Erro ao excluir produto." }
    }

    revalidatePath("/dashboard/settings/products")
    return { success: true }
}
