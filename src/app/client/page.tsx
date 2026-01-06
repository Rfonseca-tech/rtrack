import { redirect } from "next/navigation"
import { prisma } from "@/infrastructure/database/prisma"
import { getCurrentUserWithRole } from "@/lib/auth-utils"
import { ClientHeader } from "@/components/client/client-header"
import { ServiceCard } from "@/components/client/service-card"

export const dynamic = "force-dynamic"

export default async function ClientDashboardPage() {
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
        return (
            <div className="min-h-screen bg-background">
                <ClientHeader
                    userName={user.name || "Cliente"}
                    userEmail={user.email || undefined}
                />
                <main className="p-5">
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                            <span className="text-2xl">📭</span>
                        </div>
                        <p className="text-lg font-medium text-foreground mb-2">
                            Nenhum serviço encontrado
                        </p>
                        <p className="text-sm text-muted-foreground max-w-[260px]">
                            Seu email não está associado a nenhuma empresa cliente.
                        </p>
                    </div>
                </main>
            </div>
        )
    }

    // Get projects for this client
    const projects = await prisma.project.findMany({
        where: {
            clientId: client.id,
        },
        include: {
            tasks: {
                orderBy: { updatedAt: "desc" },
                take: 1,
            },
            _count: {
                select: { tasks: true },
            },
        },
        orderBy: { updatedAt: "desc" },
    })

    // If only 1 project, redirect directly to it
    if (projects.length === 1) {
        redirect(`/client/services/${projects[0].id}`)
    }

    return (
        <div className="min-h-screen bg-background">
            <ClientHeader
                userName={user.name || "Cliente"}
                userEmail={user.email || undefined}
            />
            {/* Main content - Mobile-first padding */}
            <main className="p-5 pb-8 space-y-6">
                {/* Page Title - Large text for mobile */}
                <div>
                    <h2 className="text-2xl font-bold">Seus Serviços</h2>
                    <p className="text-muted-foreground mt-1">
                        {projects.length} {projects.length === 1 ? "serviço" : "serviços"}
                    </p>
                </div>

                {/* Services List - With gap for touch separation */}
                <div className="space-y-4">
                    {projects.map((project) => (
                        <ServiceCard
                            key={project.id}
                            id={project.id}
                            name={project.name}
                            status={project.isActive ? "ACTIVE" : "COMPLETED"}
                            updateCount={project._count.tasks}
                        />
                    ))}
                </div>

                {projects.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                            <span className="text-2xl">📋</span>
                        </div>
                        <p className="text-lg font-medium text-foreground mb-2">
                            Nenhum serviço ainda
                        </p>
                        <p className="text-sm text-muted-foreground max-w-[260px]">
                            Quando você contratar serviços, eles aparecerão aqui.
                        </p>
                    </div>
                )}
            </main>
        </div>
    )
}
