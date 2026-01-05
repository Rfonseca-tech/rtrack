import Link from "next/link"
import { BentoCard } from "../bento-card"
import { Briefcase, ArrowRight } from "lucide-react"

interface Project {
    id: string
    name: string
    clientName: string
    status: 'ACTIVE' | 'COMPLETED' | 'ON_HOLD' | 'ARCHIVED'
    progress?: number
}

interface ProjectsWidgetProps {
    projects: Project[]
    title?: string
}

const statusColors = {
    ACTIVE: "bg-emerald-500",
    COMPLETED: "bg-blue-500",
    ON_HOLD: "bg-amber-500",
    ARCHIVED: "bg-gray-400",
}

const statusLabels = {
    ACTIVE: "Ativo",
    COMPLETED: "Concluído",
    ON_HOLD: "Pausado",
    ARCHIVED: "Arquivado",
}

/**
 * ProjectsWidget - Display a list of recent/active projects
 */
export function ProjectsWidget({ projects, title = "Projetos Ativos" }: ProjectsWidgetProps) {
    return (
        <BentoCard
            size="wide"
            title={title}
            icon={<Briefcase className="h-4 w-4" />}
        >
            <div className="space-y-3">
                {projects.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Nenhum projeto encontrado.</p>
                ) : (
                    projects.slice(0, 5).map((project) => (
                        <Link
                            key={project.id}
                            href={`/dashboard/projects/${project.id}`}
                            className="flex items-center justify-between p-2 -mx-2 rounded hover:bg-muted/50 transition-colors group"
                        >
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">
                                    {project.name}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                    {project.clientName}
                                </p>
                            </div>
                            <div className="flex items-center gap-2 ml-2">
                                <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium text-white ${statusColors[project.status]}`}>
                                    {statusLabels[project.status]}
                                </span>
                                <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </Link>
                    ))
                )}
            </div>
            {projects.length > 5 && (
                <Link
                    href="/dashboard/projects"
                    className="block mt-3 pt-3 border-t text-xs text-primary hover:underline text-center"
                >
                    Ver todos ({projects.length} projetos)
                </Link>
            )}
        </BentoCard>
    )
}
