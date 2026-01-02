'use client'

import { useTransition } from 'react'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { deleteArea } from './actions'

interface DeleteAreaButtonProps {
    areaId: string
}

export function DeleteAreaButton({ areaId }: DeleteAreaButtonProps) {
    const [isPending, startTransition] = useTransition()

    const handleDelete = () => {
        if (confirm('Tem certeza que deseja excluir esta área?')) {
            startTransition(async () => {
                const result = await deleteArea(areaId)
                if (!result.success) {
                    alert(result.message || 'Erro ao excluir área')
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
