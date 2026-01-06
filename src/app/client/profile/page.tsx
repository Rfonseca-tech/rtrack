import { redirect } from "next/navigation"
import { getCurrentUserWithRole } from "@/lib/auth-utils"
import { ClientHeader } from "@/components/client/client-header"
import { Mail, Shield } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function ClientProfilePage() {
    const user = await getCurrentUserWithRole()

    if (!user) {
        redirect("/login")
    }

    // Format role for display
    const roleLabels: Record<string, string> = {
        ROOT: "Administrador Master",
        ADMIN: "Administrador",
        EMPLOYEE: "Funcionário",
        CLIENT: "Cliente",
    }

    const roleLabel = roleLabels[user.role] || user.role

    return (
        <div className="min-h-screen bg-background">
            <ClientHeader
                userName={user.name || "Cliente"}
                userEmail={user.email || undefined}
                title="Meu Perfil"
                showBackButton={true}
            />

            {/* Profile Content - Mobile-first */}
            <main className="p-5 pb-8 space-y-6">
                {/* Profile Card */}
                <div className="p-6 rounded-2xl border-2 bg-card">
                    {/* Avatar and Name */}
                    <div className="flex flex-col items-center text-center mb-6">
                        <div className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mb-4">
                            {user.name
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()
                                .slice(0, 2) || "?"}
                        </div>
                        <h2 className="text-xl font-semibold">{user.name}</h2>
                        <p className="text-sm text-muted-foreground mt-1">{roleLabel}</p>
                    </div>

                    {/* Info Grid */}
                    <div className="space-y-4">
                        {/* Email */}
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                <Mail className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                                    Email
                                </p>
                                <p className="text-sm font-medium truncate">{user.email}</p>
                            </div>
                        </div>

                        {/* Role */}
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                <Shield className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                                    Tipo de Conta
                                </p>
                                <p className="text-sm font-medium">{roleLabel}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Help Section */}
                <div className="p-5 rounded-2xl border-2 bg-muted/30 text-center">
                    <p className="text-sm text-muted-foreground">
                        Precisa de ajuda?
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                        Entre em contato: <strong>suporte@rfonseca.adv.br</strong>
                    </p>
                </div>
            </main>
        </div>
    )
}
