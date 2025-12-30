'use client'

import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { deleteProject } from './actions'
import { useTransition } from 'react'

export function DeleteProjectButton({ projectId, projectName }: { projectId: string; projectName: string }) {
    const [isPending, startTransition] = useTransition()

    const handleDelete = () => {
        if (confirm(`Tem certeza que deseja excluir o projeto "${projectName}"? Esta ação não pode ser desfeita.`)) {
            startTransition(async () => {
                const result = await deleteProject(projectId)
                if (!result.success) {
                    alert(result.message || 'Erro ao excluir projeto')
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
            className="text-destructive hover:text-destructive"
        >
            <Trash2 className="h-4 w-4" />
        </Button>
    )
}
