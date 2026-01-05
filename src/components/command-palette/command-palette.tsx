"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Command as CommandPrimitive } from "cmdk"
import { Search, FileText, Users, Briefcase, Settings, Plus } from "lucide-react"

import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog"

interface CommandPaletteProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    role?: string
}

export function CommandPalette({ open, onOpenChange, role }: CommandPaletteProps) {
    const router = useRouter()
    const [search, setSearch] = React.useState("")

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                onOpenChange(!open)
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [open, onOpenChange])

    const runCommand = React.useCallback((command: () => void) => {
        onOpenChange(false)
        command()
    }, [onOpenChange])

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="overflow-hidden p-0 shadow-lg" showCloseButton={false}>
                <CommandPrimitive className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
                    <div className="flex items-center border-b px-3">
                        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                        <CommandPrimitive.Input
                            value={search}
                            onValueChange={setSearch}
                            placeholder="Digite um comando ou pesquise..."
                            className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>
                    <CommandPrimitive.List className="max-h-[300px] overflow-y-auto overflow-x-hidden">
                        <CommandPrimitive.Empty className="py-6 text-center text-sm">
                            Nenhum resultado encontrado.
                        </CommandPrimitive.Empty>

                        {/* Quick Actions - Only for Employees/Admins */}
                        {role !== 'CLIENT' && (
                            <CommandPrimitive.Group heading="Ações Rápidas">
                                <CommandPrimitive.Item
                                    onSelect={() => runCommand(() => router.push("/dashboard/projects/new"))}
                                    className="cursor-pointer rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground"
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    <span>Novo Projeto</span>
                                </CommandPrimitive.Item>
                                <CommandPrimitive.Item
                                    onSelect={() => runCommand(() => router.push("/dashboard/clients/new"))}
                                    className="cursor-pointer rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground"
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    <span>Novo Cliente</span>
                                </CommandPrimitive.Item>
                                <CommandPrimitive.Item
                                    onSelect={() => runCommand(() => router.push("/dashboard/tasks/new"))}
                                    className="cursor-pointer rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground"
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    <span>Nova Tarefa</span>
                                </CommandPrimitive.Item>
                            </CommandPrimitive.Group>
                        )}

                        {/* Navigation */}
                        <CommandPrimitive.Group heading="Navegação">
                            <CommandPrimitive.Item
                                onSelect={() => runCommand(() => router.push("/dashboard/projects"))}
                                className="cursor-pointer rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground"
                            >
                                <Briefcase className="mr-2 h-4 w-4" />
                                <span>Projetos</span>
                            </CommandPrimitive.Item>
                            <CommandPrimitive.Item
                                onSelect={() => runCommand(() => router.push("/dashboard/clients"))}
                                className="cursor-pointer rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground"
                            >
                                <Users className="mr-2 h-4 w-4" />
                                <span>Clientes</span>
                            </CommandPrimitive.Item>
                            <CommandPrimitive.Item
                                onSelect={() => runCommand(() => router.push("/dashboard/tasks"))}
                                className="cursor-pointer rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground"
                            >
                                <FileText className="mr-2 h-4 w-4" />
                                <span>Tarefas</span>
                            </CommandPrimitive.Item>
                            <CommandPrimitive.Item
                                onSelect={() => runCommand(() => router.push("/dashboard/settings"))}
                                className="cursor-pointer rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground"
                            >
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Configurações</span>
                            </CommandPrimitive.Item>
                        </CommandPrimitive.Group>
                    </CommandPrimitive.List>
                </CommandPrimitive>
            </DialogContent>
        </Dialog>
    )
}
