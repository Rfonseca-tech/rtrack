import { Metadata } from 'next'
import { CheckSquare } from 'lucide-react'

export const metadata: Metadata = {
    title: 'Tarefas',
}

export default function TasksPage() {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Tarefas</h1>
            </div>

            <div className="rounded-md border bg-card p-8">
                <div className="flex flex-col items-center justify-center gap-4 text-center">
                    <CheckSquare className="h-12 w-12 text-muted-foreground" />
                    <h2 className="text-lg font-semibold">Nenhuma tarefa encontrada</h2>
                    <p className="text-sm text-muted-foreground max-w-md">
                        As tarefas são criadas automaticamente quando você adiciona projetos.
                        Acesse um projeto para ver e gerenciar suas tarefas.
                    </p>
                </div>
            </div>
        </div>
    )
}
