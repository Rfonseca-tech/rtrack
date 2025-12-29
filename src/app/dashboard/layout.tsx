import { createClient } from "@/infrastructure/auth/supabase-server"
import { redirect } from "next/navigation"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { Header } from "@/components/layout/header"

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect("/login")
    }

    // Preparar dados do usuário para o menu
    // Tentar pegar nome do metadata ou usar email
    const name = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0]
    const userData = {
        name: name,
        email: user.email,
        initials: name?.substring(0, 2).toUpperCase() || "U"
    }

    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <div className="hidden border-r bg-muted/40 md:block">
                <div className="flex h-full max-h-screen flex-col gap-2">
                    {/* AppSidebar já renderiza container flex interno, mas aqui envolvemos para garantir layout do grid */}
                    <AppSidebar />
                </div>
            </div>
            <div className="flex flex-col">
                <Header user={userData} />
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}
