'use client'

import { useTransition } from 'react'
import { UserX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { deleteUser } from './actions'

interface DeleteUserButtonProps {
    userId: string
}

export function DeleteUserButton({ userId }: DeleteUserButtonProps) {
    const [isPending, startTransition] = useTransition()

    const handleDelete = () => {
        if (confirm('Tem certeza que deseja desativar este usuário?')) {
            startTransition(async () => {
                const result = await deleteUser(userId)
                if (!result.success) {
                    alert(result.message || 'Erro ao desativar usuário')
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
            title="Desativar usuário"
        >
            <UserX className="h-4 w-4" />
        </Button>
    )
}
