'use client'

import { useTransition } from 'react'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { deleteTask } from './actions'

interface DeleteTaskButtonProps {
    taskId: string
}

export function DeleteTaskButton({ taskId }: DeleteTaskButtonProps) {
    const [isPending, startTransition] = useTransition()

    const handleDelete = () => {
        if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
            startTransition(async () => {
                const result = await deleteTask(taskId)
                if (!result.success) {
                    alert(result.error || 'Erro ao excluir tarefa')
                }
            })
        }
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            disabled={isPending}
            className="h-8 w-8 text-destructive hover:text-destructive"
        >
            <Trash2 className="h-4 w-4" />
        </Button>
    )
}
