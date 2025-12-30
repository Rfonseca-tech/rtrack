'use client'

import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { deleteClient } from './actions'
import { useTransition } from 'react'

export function DeleteClientButton({ clientId, clientName }: { clientId: string; clientName: string }) {
    const [isPending, startTransition] = useTransition()

    const handleDelete = () => {
        if (confirm(`Tem certeza que deseja excluir o cliente "${clientName}"? Esta ação não pode ser desfeita.`)) {
            startTransition(async () => {
                const result = await deleteClient(clientId)
                if (!result.success) {
                    alert(result.message || 'Erro ao excluir cliente')
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
