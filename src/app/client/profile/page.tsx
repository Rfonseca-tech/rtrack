import { redirect } from "next/navigation"
import { prisma } from "@/infrastructure/database/prisma"
import { getCurrentUserWithRole } from "@/lib/auth-utils"
import { ClientHeader } from "@/components/client/client-header"
import { EmailManager } from "@/components/client/email-manager"
import { Mail, Shield, Phone, Building2, FileText, Download, ExternalLink } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function ClientProfilePage() {
    const user = await getCurrentUserWithRole()

    if (!user) {
        redirect("/login")
    }

    // Get client by email domain
    const userEmailDomain = user.email?.split("@")[1] || ""
    const client = await prisma.client.findFirst({
        where: { emailDomain: userEmailDomain },
        include: { emails: { orderBy: { isPrimary: "desc" } } },
    })

    // Format role for display
    const roleLabels: Record<string, string> = {
        ROOT: "Administrador Master",
        ADMIN: "Administrador",
        EMPLOYEE: "Funcionário",
        CLIENT: "Cliente",
    }

    const roleLabel = roleLabels[user.role] || user.role

    // Format CNPJ (XX.XXX.XXX/XXXX-XX)
    const formatCnpj = (cnpj: string) => {
        const clean = cnpj.replace(/\D/g, "")
        return clean.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5")
    }

    // Format phone for WhatsApp link
    const formatWhatsAppLink = (phone: string) => {
        const clean = phone.replace(/\D/g, "")
        return `https://wa.me/${clean}`
    }

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
                {/* User Info Card */}
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

                    {/* User Email */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                <Mail className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                                    Email de Login
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

                {/* Client Company Info - Only show if client exists */}
                {client && (
                    <div className="p-6 rounded-2xl border-2 bg-card space-y-4">
                        <h3 className="font-semibold text-lg">Dados da Empresa</h3>

                        {/* Company Name */}
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                <Building2 className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                                    Razão Social
                                </p>
                                <p className="text-sm font-medium">{client.razaoSocial}</p>
                            </div>
                        </div>

                        {/* CNPJ */}
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                <FileText className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                                    CNPJ
                                </p>
                                <p className="text-sm font-medium font-mono">{formatCnpj(client.cnpj)}</p>
                            </div>
                        </div>

                        {/* Phone (WhatsApp) */}
                        {client.phone && (
                            <a
                                href={formatWhatsAppLink(client.phone)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-4 p-4 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors"
                            >
                                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                                    <Phone className="h-5 w-5 text-emerald-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                                        WhatsApp
                                    </p>
                                    <p className="text-sm font-medium">{client.phone}</p>
                                </div>
                                <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0" />
                            </a>
                        )}
                    </div>
                )}

                {/* Contact Emails - Only show if client exists */}
                {client && (
                    <div className="p-6 rounded-2xl border-2 bg-card">
                        <EmailManager initialEmails={client.emails} />
                    </div>
                )}

                {/* Contract Download - Only show if contract exists */}
                {client?.contractUrl && (
                    <a
                        href={client.contractUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 p-5 rounded-2xl border-2 bg-primary/5 hover:bg-primary/10 transition-colors"
                    >
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                            <Download className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold">Contrato</p>
                            <p className="text-xs text-muted-foreground">
                                Clique para visualizar ou baixar
                            </p>
                        </div>
                        <ExternalLink className="h-5 w-5 text-muted-foreground shrink-0" />
                    </a>
                )}

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
