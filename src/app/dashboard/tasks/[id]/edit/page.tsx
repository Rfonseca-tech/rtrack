import { Metadata } from 'next'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { getCurrentUserWithRole } from '@/lib/auth-utils'
import { canManageData } from '@/lib/permissions'
import { prisma } from '@/infrastructure/database/prisma'
import { updateTask } from '../../actions'

export const metadata: Metadata = {
    title: 'Editar Tarefa',
}

const statusOptions = [
    { value: 'PENDING', label: 'Pendente' },
    { value: 'IN_PROGRESS', label: 'Em Progresso' },
    { value: 'WAITING_VALIDATION', label: 'Aguardando Validação' },
    { value: 'COMPLETED', label: 'Concluída' },
]

export default async function EditTaskPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const user = await getCurrentUserWithRole()

    if (!user || !canManageData(user.role)) {
        redirect('/dashboard/tasks')
    }

    const [task, projects] = await Promise.all([
        prisma.task.findUnique({
            where: { id },
        }),
        prisma.project.findMany({
            where: { isActive: true },
            include: {
                client: {
                    select: { razaoSocial: true }
                }
            },
            orderBy: { name: 'asc' }
        })
    ])

    if (!task) {
        notFound()
    }

    const updateTaskWithId = updateTask.bind(null, id)

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard/tasks">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <h1 className="text-2xl font-bold tracking-tight">Editar Tarefa</h1>
            </div>

            <div className="rounded-md border bg-card p-6 max-w-2xl">
                <form action={updateTaskWithId} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Título</Label>
                        <Input
                            id="title"
                            name="title"
                            placeholder="Descreva a tarefa"
                            defaultValue={task.title}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Descrição</Label>
                        <Textarea
                            id="description"
                            name="description"
                            placeholder="Detalhes adicionais (opcional)"
                            defaultValue={task.description || ''}
                            rows={3}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="projectId">Projeto</Label>
                        <Select name="projectId" defaultValue={task.projectId} required>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione um projeto" />
                            </SelectTrigger>
                            <SelectContent>
                                {projects.map((project) => (
                                    <SelectItem key={project.id} value={project.id}>
                                        {project.name} - {project.client.razaoSocial}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select name="status" defaultValue={task.status}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione o status" />
                            </SelectTrigger>
                            <SelectContent>
                                {statusOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="dueDate">Prazo</Label>
                        <Input
                            id="dueDate"
                            name="dueDate"
                            type="date"
                            defaultValue={task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''}
                        />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <Button type="submit">Salvar Alterações</Button>
                        <Button type="button" variant="outline" asChild>
                            <Link href="/dashboard/tasks">Cancelar</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
