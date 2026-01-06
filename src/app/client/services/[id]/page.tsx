import { redirect, notFound } from "next/navigation"
import { prisma } from "@/infrastructure/database/prisma"
import { getCurrentUserWithRole } from "@/lib/auth-utils"
import { ClientHeader } from "@/components/client/client-header"
import { ActivityCard, type ActivityDocument } from "@/components/client/activity-card"

export const dynamic = "force-dynamic"

interface ServicePageProps {
    params: Promise<{ id: string }>
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
    const { id } = await params
    const user = await getCurrentUserWithRole()

    if (!user) {
        redirect("/login")
    }

    // Extract domain from user email
    const userEmailDomain = user.email?.split("@")[1] || ""

    // Get client associated with this user by email domain
    const client = await prisma.client.findFirst({
        where: {
            emailDomain: userEmailDomain,
        },
    })

    if (!client) {
        redirect("/client")
    }

    // Get project with tasks and documents
    const project = await prisma.project.findFirst({
        where: {
            id,
            clientId: client.id, // Ensure client can only see their own projects
        },
        include: {
            tasks: {
                include: {
                    documents: true,
                },
                orderBy: { updatedAt: "desc" },
            },
        },
    })

    if (!project) {
        notFound()
    }

    // Map status to Portuguese
    const mapStatus = (status: string) => {
        const statusMap: Record<string, string> = {
            PENDING: "Pendente",
            IN_PROGRESS: "Em Progresso",
            WAITING_VALIDATION: "Aguardando Validação",
            COMPLETED: "Concluída",
        }
        return statusMap[status] || status
    }

    // Transform tasks into activities
    const activities = project.tasks.map((task) => ({
        id: task.id,
        responsibleName: task.assignedTo || "Equipe",
        content: task.title + (task.description ? `: ${task.description}` : ""),
        date: task.updatedAt,
        status: mapStatus(task.status),
        deadline: task.dueDate || undefined,
        documents: task.documents.map((doc): ActivityDocument => ({
            id: doc.id,
            name: doc.fileName,
            url: doc.fileUrl,
            size: doc.fileSize ? `${Math.round(doc.fileSize / 1024)} KB` : undefined,
        })),
    }))

    return (
        <div className="min-h-screen bg-background">
            <ClientHeader
                userName={user.name || "Cliente"}
                userEmail={user.email || undefined}
                title={project.name}
                showBackButton={true}
            />
            {/* Activity Feed - Mobile-first layout */}
            <main className="p-5 pb-8 space-y-4">
                {activities.length > 0 ? (
                    <div className="space-y-4">
                        {activities.map((activity) => (
                            <ActivityCard
                                key={activity.id}
                                id={activity.id}
                                responsibleName={activity.responsibleName}
                                content={activity.content}
                                date={activity.date}
                                status={activity.status}
                                deadline={activity.deadline}
                                documents={activity.documents}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                            <span className="text-2xl">💬</span>
                        </div>
                        <p className="text-lg font-medium text-foreground mb-2">
                            Nenhuma atualização ainda
                        </p>
                        <p className="text-sm text-muted-foreground max-w-[260px]">
                            Quando houver atualizações no seu serviço, elas aparecerão aqui.
                        </p>
                    </div>
                )}
            </main>
        </div>
    )
}
