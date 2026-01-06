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
            <>
                <ClientHeader
                    userName={user.name || "Cliente"}
                    userEmail={user.email || undefined}
                />
                <main className="p-4">
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">
                            Nenhum serviço encontrado.
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                            Seu email não está associado a nenhuma empresa cliente.
                        </p>
                    </div>
                </main>
            </>
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
        <>
            <ClientHeader
                userName={user.name || "Cliente"}
                userEmail={user.email || undefined}
            />
            <main className="p-4 space-y-6">
                {/* Page Title */}
                <div>
                    <h2 className="text-2xl font-semibold">Seus Serviços</h2>
                    <p className="text-muted-foreground text-sm mt-1">
                        {projects.length} {projects.length === 1 ? "serviço contratado" : "serviços contratados"}
                    </p>
                </div>

                {/* Services List */}
                <div className="space-y-3">
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
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">
                            Nenhum serviço encontrado.
                        </p>
                    </div>
                )}
            </main>
        </>
    )
}
