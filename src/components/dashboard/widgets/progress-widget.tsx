import { BentoCard } from "../bento-card"
import { TrendingUp } from "lucide-react"

interface ProgressWidgetProps {
    projectName: string
    progress: number // 0-100
    currentPhase?: string
    totalTasks?: number
    completedTasks?: number
}

/**
 * ProgressWidget - Project progress visualization (Client view)
 */
export function ProgressWidget({
    projectName,
    progress,
    currentPhase,
    totalTasks,
    completedTasks
}: ProgressWidgetProps) {
    return (
        <BentoCard
            size="wide"
            title="Progresso do Seu Caso"
            icon={<TrendingUp className="h-4 w-4" />}
        >
            <div className="space-y-4">
                <div>
                    <p className="text-lg font-semibold">{projectName}</p>
                    {currentPhase && (
                        <p className="text-sm text-muted-foreground">
                            Fase atual: {currentPhase}
                        </p>
                    )}
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progresso Geral</span>
                        <span className="font-semibold">{progress}%</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary transition-all duration-500 ease-out"
                            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                        />
                    </div>
                </div>

                {/* Task Summary */}
                {totalTasks !== undefined && completedTasks !== undefined && (
                    <div className="flex justify-between text-sm pt-2 border-t">
                        <span className="text-muted-foreground">Etapas Concluídas</span>
                        <span className="font-medium">
                            {completedTasks} de {totalTasks}
                        </span>
                    </div>
                )}
            </div>
        </BentoCard>
    )
}
