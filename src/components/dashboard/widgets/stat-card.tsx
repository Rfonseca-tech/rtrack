import { BentoCard } from "../bento-card"
import { LucideIcon } from "lucide-react"

interface StatCardProps {
    title: string
    value: string | number
    description?: string
    icon: LucideIcon
    trend?: {
        value: number
        isPositive: boolean
    }
}

/**
 * StatCard - Display a single metric with optional trend indicator
 */
export function StatCard({ title, value, description, icon: Icon, trend }: StatCardProps) {
    return (
        <BentoCard>
            <div className="flex items-start justify-between">
                <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">{title}</p>
                    <p className="text-2xl font-bold tracking-tight">{value}</p>
                    {description && (
                        <p className="text-xs text-muted-foreground">{description}</p>
                    )}
                    {trend && (
                        <p className={`text-xs ${trend.isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
                        </p>
                    )}
                </div>
                <div className="rounded-md bg-primary/10 p-2.5">
                    <Icon className="h-5 w-5 text-primary" />
                </div>
            </div>
        </BentoCard>
    )
}
