import { TaskStatus } from '@prisma/client'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const statusConfig: Record<TaskStatus, { label: string; className: string }> = {
    PENDING: {
        label: 'Pendente',
        className: 'bg-gray-100 text-gray-800 hover:bg-gray-100',
    },
    IN_PROGRESS: {
        label: 'Em Progresso',
        className: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
    },
    WAITING_VALIDATION: {
        label: 'Aguardando Validação',
        className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
    },
    COMPLETED: {
        label: 'Concluída',
        className: 'bg-green-100 text-green-800 hover:bg-green-100',
    },
}

interface TaskStatusBadgeProps {
    status: TaskStatus
    className?: string
}

export function TaskStatusBadge({ status, className }: TaskStatusBadgeProps) {
    const config = statusConfig[status]

    return (
        <Badge variant="secondary" className={cn(config.className, className)}>
            {config.label}
        </Badge>
    )
}
