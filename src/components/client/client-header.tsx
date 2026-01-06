"use client"

import * as React from "react"
import { Menu, X, User, LogOut, Home } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ClientHeaderProps {
    userName: string
    userEmail?: string
    title?: string
    showBackButton?: boolean
    onBackClick?: () => void
}

/**
 * ClientHeader - Minimalist header for client portal
 * 
 * Features:
 * - Hamburger menu (☰) on left
 * - Title/Logo in center
 * - User avatar with dropdown on right
 */
export function ClientHeader({
    userName,
    userEmail,
    title = "RTrack",
    showBackButton = false,
    onBackClick,
}: ClientHeaderProps) {
    const [menuOpen, setMenuOpen] = React.useState(false)
    const pathname = usePathname()

    // Get initials for avatar
    const initials = userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)

    return (
        <>
            {/* Header */}
            <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex h-14 items-center justify-between px-4">
                    {/* Left: Menu or Back button */}
                    <div className="flex items-center gap-2">
                        {showBackButton ? (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="touch-target"
                                onClick={onBackClick}
                            >
                                <span className="sr-only">Voltar</span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="m15 18-6-6 6-6" />
                                </svg>
                            </Button>
                        ) : (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="touch-target"
                                onClick={() => setMenuOpen(true)}
                            >
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Menu</span>
                            </Button>
                        )}
                    </div>

                    {/* Center: Title */}
                    <h1 className="text-lg font-semibold truncate max-w-[50%]">
                        {title}
                    </h1>

                    {/* Right: Avatar */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="relative h-9 w-9 rounded-full touch-target"
                            >
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                                    {initials}
                                </div>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <div className="flex flex-col space-y-1 p-2">
                                <p className="text-sm font-medium">{userName}</p>
                                {userEmail && (
                                    <p className="text-xs text-muted-foreground">
                                        {userEmail}
                                    </p>
                                )}
                            </div>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href="/client/profile" className="cursor-pointer">
                                    <User className="mr-2 h-4 w-4" />
                                    Meu Perfil
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href="/login" className="cursor-pointer text-destructive">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Sair
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            {menuOpen && (
                <div className="fixed inset-0 z-50">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={() => setMenuOpen(false)}
                    />

                    {/* Menu Panel */}
                    <div className="absolute left-0 top-0 h-full w-72 bg-background shadow-xl animate-in slide-in-from-left duration-300">
                        {/* Menu Header */}
                        <div className="flex items-center justify-between p-4 border-b">
                            <span className="font-semibold">Menu</span>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setMenuOpen(false)}
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        {/* Menu Items */}
                        <nav className="p-4 space-y-2">
                            <Link
                                href="/client"
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors touch-target",
                                    pathname === "/client"
                                        ? "bg-primary text-primary-foreground"
                                        : "hover:bg-muted"
                                )}
                                onClick={() => setMenuOpen(false)}
                            >
                                <Home className="h-5 w-5" />
                                Meus Serviços
                            </Link>
                            <Link
                                href="/client/profile"
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors touch-target",
                                    pathname === "/client/profile"
                                        ? "bg-primary text-primary-foreground"
                                        : "hover:bg-muted"
                                )}
                                onClick={() => setMenuOpen(false)}
                            >
                                <User className="h-5 w-5" />
                                Meu Perfil
                            </Link>
                        </nav>

                        {/* Menu Footer */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
                            <Link
                                href="/login"
                                className="flex items-center gap-3 px-4 py-3 rounded-lg text-destructive hover:bg-destructive/10 transition-colors touch-target"
                            >
                                <LogOut className="h-5 w-5" />
                                Sair
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
