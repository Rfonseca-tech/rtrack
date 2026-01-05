import { BentoCard } from "../bento-card"
import { Users, Mail, Phone } from "lucide-react"

interface TeamMember {
    name: string
    role: string
    email?: string
    phone?: string
}

interface TeamWidgetProps {
    members: TeamMember[]
}

/**
 * TeamWidget - Display assigned team members (Client view)
 */
export function TeamWidget({ members }: TeamWidgetProps) {
    return (
        <BentoCard
            title="Sua Equipe"
            icon={<Users className="h-4 w-4" />}
        >
            <div className="space-y-3">
                {members.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                        Nenhum responsável atribuído.
                    </p>
                ) : (
                    members.map((member, index) => (
                        <div key={index} className="space-y-1">
                            <p className="text-sm font-medium">{member.name}</p>
                            <p className="text-xs text-muted-foreground">{member.role}</p>
                            {member.email && (
                                <a
                                    href={`mailto:${member.email}`}
                                    className="flex items-center gap-1 text-xs text-primary hover:underline"
                                >
                                    <Mail className="h-3 w-3" />
                                    {member.email}
                                </a>
                            )}
                            {member.phone && (
                                <a
                                    href={`tel:${member.phone}`}
                                    className="flex items-center gap-1 text-xs text-primary hover:underline"
                                >
                                    <Phone className="h-3 w-3" />
                                    {member.phone}
                                </a>
                            )}
                        </div>
                    ))
                )}
            </div>
        </BentoCard>
    )
}
