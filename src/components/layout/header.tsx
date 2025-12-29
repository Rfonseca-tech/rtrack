'use client'

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { AppSidebar } from "./app-sidebar"
import { UserNav } from "./user-nav"

interface HeaderProps {
    user: {
        name?: string | null
        email?: string | null
        initials?: string
    }
}

export function Header({ user }: HeaderProps) {
    return (
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <Sheet>
                <SheetTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="shrink-0 md:hidden"
                    >
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Alternar menu de navegação</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="flex flex-col p-0 w-64">
                    <AppSidebar />
                </SheetContent>
            </Sheet>
            <div className="w-full flex-1">
                {/* Placeholder para Breadcrumbs ou Título dinâmico */}
                {/* <h1 className="text-lg font-semibold">Dashboard</h1> */}
            </div>
            <UserNav user={user} />
        </header>
    )
}
