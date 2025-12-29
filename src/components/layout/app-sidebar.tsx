'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    Briefcase,
    CheckSquare,
    Users,
    Settings,
    FileText
} from "lucide-react"

const items = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Projetos",
        url: "/dashboard/projects",
        icon: Briefcase,
    },
    {
        title: "Tarefas",
        url: "/dashboard/tasks",
        icon: CheckSquare,
    },
    {
        title: "Documentos",
        url: "/dashboard/documents",
        icon: FileText,
    },
    {
        title: "Clientes",
        url: "/dashboard/clients",
        icon: Users,
    },
    {
        title: "Configurações",
        url: "/dashboard/settings",
        icon: Settings,
    },
]

export function AppSidebar() {
    const pathname = usePathname()

    return (
        <div className="flex flex-col h-full border-r bg-muted/10">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                <Link href="/" className="flex items-center gap-2 font-semibold">
                    <span className="">RTrack</span>
                </Link>
            </div>
            <nav className="grid items-start gap-2 p-4 text-sm font-medium">
                {items.map((item) => {
                    const Icon = item.icon
                    const isActive = item.url === "/dashboard"
                        ? pathname === "/dashboard"
                        : pathname.startsWith(item.url)

                    return (
                        <Link
                            key={item.url}
                            href={item.url}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                                isActive
                                    ? "bg-muted text-primary"
                                    : "text-muted-foreground"
                            )}
                        >
                            <Icon className="h-4 w-4" />
                            {item.title}
                        </Link>
                    )
                })}
            </nav>
        </div>
    )
}
