'use client'

import { useTransition } from 'react'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { deleteFamily } from './actions'

interface DeleteFamilyButtonProps {
    familyId: string
    productsCount: number
}

export function DeleteFamilyButton({ familyId, productsCount }: DeleteFamilyButtonProps) {
    const [isPending, startTransition] = useTransition()

    const handleDelete = () => {
        if (productsCount > 0) {
            window.alert(`Não é possível excluir. Existem ${productsCount} produto(s) vinculado(s).`)
            return
        }

        if (window.confirm('Tem certeza que deseja excluir esta família?')) {
            startTransition(async () => {
                const result = await deleteFamily(familyId)
                if (!result.success) {
                    window.alert(result.message)
                }
            })
        }
    }

    return (
        <Button
            type="button"
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
