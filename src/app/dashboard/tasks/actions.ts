"use server"

import { prisma } from "@/infrastructure/database/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const taskSchema = z.object({
    projectId: z.string(),
    parentId: z.string().optional(),
    title: z.string().min(1, "Título é obrigatório"),
    description: z.string().optional(),
    status: z.enum(['PENDING', 'IN_PROGRESS', 'WAITING_VALIDATION', 'COMPLETED']),
    assignedTo: z.string().optional(),
    startDate: z.string().optional().transform(str => str ? new Date(str) : null),
    dueDate: z.string().optional().transform(str => str ? new Date(str) : null),
})

export async function createTask(prevState: any, formData: FormData) {
    const validatedFields = taskSchema.safeParse({
        projectId: formData.get('projectId'),
        parentId: formData.get('parentId') || undefined,
        title: formData.get('title'),
        description: formData.get('description'),
        status: formData.get('status'),
        assignedTo: formData.get('assignedTo'),
        startDate: formData.get('startDate') || undefined,
        dueDate: formData.get('dueDate') || undefined,
    })

    if (!validatedFields.success) {
        return { error: validatedFields.error.flatten().fieldErrors }
    }

    try {
        const { projectId, parentId, ...data } = validatedFields.data

        // Get max order
        const lastTask = await prisma.task.findFirst({
            where: { projectId, parentId: parentId || null },
            orderBy: { order: 'desc' }
        })
        const order = (lastTask?.order ?? 0) + 1

        await prisma.task.create({
            data: {
                projectId,
                parentId,
                order,
                ...data
            }
        })

        revalidatePath(`/dashboard/projects/${projectId}`)
        return { success: true }
    } catch (error) {
        console.error("Create Task Error:", error)
        return { error: "Erro ao criar tarefa" }
    }
}

export async function updateTask(id: string, formData: FormData) {
    // Similar schema validation but without needing logic for order/project/parent usually
    // For simplicity using partial schema or manual extraction
    const title = formData.get('title') as string
    const status = formData.get('status') as string
    const assignedTo = formData.get('assignedTo') as string
    const startDate = formData.get('startDate') ? new Date(formData.get('startDate') as string) : null
    const dueDate = formData.get('dueDate') ? new Date(formData.get('dueDate') as string) : null

    try {
        await prisma.task.update({
            where: { id },
            data: {
                title,
                status: status as any,
                assignedTo,
                startDate,
                dueDate
            }
        })

        revalidatePath('/dashboard/projects') // generic revalidate
        return { success: true }
    } catch (error) {
        console.error("Update Task Error:", error)
        return { error: "Erro ao atualizar tarefa" }
    }
}

export async function deleteTask(id: string) {
    try {
        await prisma.task.delete({ where: { id } })
        revalidatePath('/dashboard/projects')
        return { success: true }
    } catch (error) {
        console.error("Delete Task Error:", error)
        return { error: "Erro ao deletar tarefa" }
    }
}
