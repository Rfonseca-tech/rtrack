'use client'

import { useTransition } from 'react'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { deleteProduct } from './actions'

interface DeleteProductButtonProps {
    productId: string
    templatesCount: number
}

export function DeleteProductButton({ productId, templatesCount }: DeleteProductButtonProps) {
    const [isPending, startTransition] = useTransition()

    const handleDelete = () => {
        if (templatesCount > 0) {
            window.alert(`Não é possível excluir. Existem ${templatesCount} template(s) vinculado(s).`)
            return
        }

        if (window.confirm('Tem certeza que deseja excluir este produto?')) {
            startTransition(async () => {
                const result = await deleteProduct(productId)
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
