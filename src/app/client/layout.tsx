import { redirect } from "next/navigation"
import { getCurrentUserWithRole } from "@/lib/auth-utils"

export default async function ClientLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const user = await getCurrentUserWithRole()

    // Redirect non-clients away from client portal
    if (!user) {
        redirect("/login")
    }

    if (user.role !== "CLIENT") {
        redirect("/dashboard")
    }

    return (
        <div className="min-h-screen bg-background">
            {children}
        </div>
    )
}
