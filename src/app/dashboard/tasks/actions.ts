'use server'

import { redirect } from "next/navigation"
import { z } from "zod"
import { prisma } from "@/infrastructure/database/prisma"
import { revalidatePath } from "next/cache"
import { getCurrentUserWithRole } from "@/lib/auth-utils"
import { canManageData } from "@/lib/permissions"
import { TaskStatus } from "@prisma/client"

const taskSchema = z.object({
    title: z.string().min(1, "Título é obrigatório"),
    description: z.string().optional(),
    projectId: z.string().min(1, "Projeto é obrigatório"),
    dueDate: z.string().optional(),
    status: z.nativeEnum(TaskStatus).optional().default(TaskStatus.PENDING),
})

export async function createTask(formData: FormData): Promise<void> {
    const user = await getCurrentUserWithRole()

    if (!user || !canManageData(user.role)) {
        throw new Error("Não autorizado. Apenas ROOT e ADMIN podem criar tarefas.")
    }

    // Get the max order for tasks in this project
    const projectId = formData.get("projectId") as string
    const maxOrder = await prisma.task.aggregate({
        where: { projectId },
        _max: { order: true }
    })
    const nextOrder = (maxOrder._max.order ?? 0) + 1

    const validatedFields = taskSchema.safeParse({
        title: formData.get("title"),
        description: formData.get("description") || undefined,
        projectId: projectId,
        dueDate: formData.get("dueDate") || undefined,
        status: formData.get("status") || TaskStatus.PENDING,
    })

    if (!validatedFields.success) {
        throw new Error("Erro na validação dos campos")
    }

    const { title, description, dueDate, status } = validatedFields.data

    try {
        await prisma.task.create({
            data: {
                title,
                description,
                projectId,
                dueDate: dueDate ? new Date(dueDate) : null,
                status,
                order: nextOrder,
            },
        })
    } catch (error) {
        console.error("Database Error:", error)
        throw new Error("Falha ao criar tarefa. Tente novamente.")
    }

    revalidatePath('/dashboard/tasks')
    revalidatePath(`/dashboard/projects/${projectId}`)
    redirect('/dashboard/tasks')
}

export async function updateTask(id: string, formData: FormData): Promise<void> {
    const user = await getCurrentUserWithRole()

    if (!user || !canManageData(user.role)) {
        throw new Error("Não autorizado. Apenas ROOT e ADMIN podem editar tarefas.")
    }

    const validatedFields = taskSchema.safeParse({
        title: formData.get("title"),
        description: formData.get("description") || undefined,
        projectId: formData.get("projectId"),
        dueDate: formData.get("dueDate") || undefined,
        status: formData.get("status") || TaskStatus.PENDING,
    })

    if (!validatedFields.success) {
        throw new Error("Erro na validação dos campos")
    }

    const { title, description, projectId, dueDate, status } = validatedFields.data

    try {
        const task = await prisma.task.update({
            where: { id },
            data: {
                title,
                description,
                projectId,
                dueDate: dueDate ? new Date(dueDate) : null,
                status,
                completedAt: status === TaskStatus.COMPLETED ? new Date() : null,
            },
        })

        revalidatePath('/dashboard/tasks')
        revalidatePath(`/dashboard/projects/${task.projectId}`)
    } catch (error) {
        console.error("Database Error:", error)
        throw new Error("Falha ao atualizar tarefa. Tente novamente.")
    }

    redirect('/dashboard/tasks')
}

export async function updateTaskStatus(id: string, status: TaskStatus): Promise<{ success: boolean; message?: string }> {
    const user = await getCurrentUserWithRole()

    if (!user || !canManageData(user.role)) {
        return { success: false, message: "Não autorizado." }
    }

    try {
        const task = await prisma.task.update({
            where: { id },
            data: {
                status,
                completedAt: status === TaskStatus.COMPLETED ? new Date() : null,
            },
        })

        revalidatePath('/dashboard/tasks')
        revalidatePath(`/dashboard/projects/${task.projectId}`)
        return { success: true }
    } catch (error) {
        console.error("Database Error:", error)
        return { success: false, message: "Falha ao atualizar status." }
    }
}

export async function deleteTask(id: string): Promise<{ success: boolean; message?: string }> {
    const user = await getCurrentUserWithRole()

    if (!user || !canManageData(user.role)) {
        return { success: false, message: "Não autorizado. Apenas ROOT e ADMIN podem excluir tarefas." }
    }

    try {
        const task = await prisma.task.delete({
            where: { id },
        })
        revalidatePath('/dashboard/tasks')
        revalidatePath(`/dashboard/projects/${task.projectId}`)
        return { success: true }
    } catch (error) {
        console.error("Database Error:", error)
        return { success: false, message: "Falha ao excluir tarefa." }
    }
}
