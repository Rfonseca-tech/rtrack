import Link from "next/link"
import { BentoCard } from "../bento-card"
import { Plus } from "lucide-react"
import { LucideIcon } from "lucide-react"

interface QuickAction {
    label: string
    href: string
    icon: LucideIcon
}

interface QuickActionsWidgetProps {
    actions: QuickAction[]
}

/**
 * QuickActionsWidget - Grid of quick action buttons (Admin only)
 */
export function QuickActionsWidget({ actions }: QuickActionsWidgetProps) {
    return (
        <BentoCard title="Ações Rápidas" icon={<Plus className="h-4 w-4" />}>
            <div className="grid grid-cols-2 gap-2">
                {actions.map((action) => {
                    const Icon = action.icon
                    return (
                        <Link
                            key={action.href}
                            href={action.href}
                            className="flex flex-col items-center justify-center gap-1.5 p-3 rounded border border-dashed border-muted-foreground/30 hover:border-primary hover:bg-primary/5 transition-colors text-center"
                        >
                            <Icon className="h-5 w-5 text-muted-foreground" />
                            <span className="text-xs font-medium">{action.label}</span>
                        </Link>
                    )
                })}
            </div>
        </BentoCard>
    )
}
