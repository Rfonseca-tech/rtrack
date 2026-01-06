"use client"

import * as React from "react"
import { Menu, X, User, LogOut, Home, ChevronLeft } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface ClientHeaderProps {
    userName: string
    userEmail?: string
    title?: string
    showBackButton?: boolean
}

/**
 * ClientHeader - Mobile-first header for client portal
 * 
 * Features:
 * - Hamburger menu (☰) on left
 * - Title in center
 * - User avatar on right
 * - 100% mobile-first design
 */
export function ClientHeader({
    userName,
    userEmail,
    title = "RTrack",
    showBackButton = false,
}: ClientHeaderProps) {
    const [menuOpen, setMenuOpen] = React.useState(false)
    const pathname = usePathname()
    const router = useRouter()

    // Get initials for avatar
    const initials = userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)

    const handleBack = () => {
        router.back()
    }

    return (
        <>
            {/* Header - Mobile-first: taller on mobile, safe area support */}
            <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 safe-area-inset">
                <div className="flex h-16 items-center justify-between px-4">
                    {/* Left: Menu or Back button - Large touch target */}
                    <div className="flex items-center">
                        {showBackButton ? (
                            <button
                                type="button"
                                className="flex items-center justify-center w-12 h-12 -ml-2 rounded-full active:bg-muted transition-colors"
                                onClick={handleBack}
                            >
                                <ChevronLeft className="h-6 w-6" />
                                <span className="sr-only">Voltar</span>
                            </button>
                        ) : (
                            <button
                                type="button"
                                className="flex items-center justify-center w-12 h-12 -ml-2 rounded-full active:bg-muted transition-colors"
                                onClick={() => setMenuOpen(true)}
                            >
                                <Menu className="h-6 w-6" />
                                <span className="sr-only">Menu</span>
                            </button>
                        )}
                    </div>

                    {/* Center: Title - Larger text for mobile readability */}
                    <h1 className="text-lg font-semibold truncate max-w-[60%] text-center">
                        {title}
                    </h1>

                    {/* Right: Avatar - Large touch target */}
                    <button
                        type="button"
                        className="flex items-center justify-center w-12 h-12 -mr-2 rounded-full active:bg-muted transition-colors"
                        onClick={() => setMenuOpen(true)}
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                            {initials}
                        </div>
                    </button>
                </div>
            </header>

            {/* Mobile Menu Overlay - Full screen slide-in */}
            {menuOpen && (
                <div className="fixed inset-0 z-50">
                    {/* Backdrop - Touch to close */}
                    <div
                        className="absolute inset-0 bg-black/60"
                        onClick={() => setMenuOpen(false)}
                    />

                    {/* Menu Panel - Full width on very small screens, 80% on larger */}
                    <div className="absolute left-0 top-0 h-full w-[85%] max-w-sm bg-background shadow-2xl animate-in slide-in-from-left duration-300 safe-area-inset">
                        {/* Menu Header - User info */}
                        <div className="p-6 border-b bg-muted/30">
                            <div className="flex items-center gap-4">
                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground text-lg font-semibold">
                                    {initials}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-base truncate">{userName}</p>
                                    {userEmail && (
                                        <p className="text-sm text-muted-foreground truncate">
                                            {userEmail}
                                        </p>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    className="flex items-center justify-center w-12 h-12 rounded-full active:bg-muted transition-colors"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                        </div>

                        {/* Menu Items - Large touch targets */}
                        <nav className="p-4 space-y-1">
                            <Link
                                href="/client"
                                className={cn(
                                    "flex items-center gap-4 px-4 py-4 rounded-xl transition-colors",
                                    "active:scale-[0.98] min-h-[56px]",
                                    pathname === "/client"
                                        ? "bg-primary text-primary-foreground"
                                        : "hover:bg-muted active:bg-muted"
                                )}
                                onClick={() => setMenuOpen(false)}
                            >
                                <Home className="h-6 w-6" />
                                <span className="text-base font-medium">Meus Serviços</span>
                            </Link>
                            <Link
                                href="/client/profile"
                                className={cn(
                                    "flex items-center gap-4 px-4 py-4 rounded-xl transition-colors",
                                    "active:scale-[0.98] min-h-[56px]",
                                    pathname === "/client/profile"
                                        ? "bg-primary text-primary-foreground"
                                        : "hover:bg-muted active:bg-muted"
                                )}
                                onClick={() => setMenuOpen(false)}
                            >
                                <User className="h-6 w-6" />
                                <span className="text-base font-medium">Meu Perfil</span>
                            </Link>
                        </nav>

                        {/* Menu Footer - Logout button */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 border-t safe-area-inset">
                            <Link
                                href="/login"
                                className="flex items-center gap-4 px-4 py-4 rounded-xl text-destructive hover:bg-destructive/10 active:bg-destructive/20 transition-colors min-h-[56px]"
                            >
                                <LogOut className="h-6 w-6" />
                                <span className="text-base font-medium">Sair</span>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
