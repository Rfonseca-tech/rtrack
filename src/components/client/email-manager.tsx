"use client"

import * as React from "react"
import { Mail, MoreHorizontal, Plus, Pencil, Trash2, Check, X, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ClientEmailType {
    id: string
    email: string
    label: string | null
    isPrimary: boolean
}

interface EmailManagerProps {
    initialEmails: ClientEmailType[]
}

export function EmailManager({ initialEmails }: EmailManagerProps) {
    const [emails, setEmails] = React.useState<ClientEmailType[]>(initialEmails)
    const [isLoading, setIsLoading] = React.useState(false)
    const [editingEmail, setEditingEmail] = React.useState<ClientEmailType | null>(null)
    const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
    const [deletingEmail, setDeletingEmail] = React.useState<ClientEmailType | null>(null)

    // Form state
    const [formEmail, setFormEmail] = React.useState("")
    const [formLabel, setFormLabel] = React.useState("")

    const refreshEmails = async () => {
        try {
            const res = await fetch("/api/client/emails")
            if (res.ok) {
                const data = await res.json()
                setEmails(data.emails)
            }
        } catch (error) {
            console.error("Failed to refresh emails:", error)
        }
    }

    const handleAdd = async () => {
        if (!formEmail.trim()) return
        setIsLoading(true)
        try {
            const res = await fetch("/api/client/emails", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: formEmail, label: formLabel || null }),
            })
            if (res.ok) {
                await refreshEmails()
                setIsAddDialogOpen(false)
                setFormEmail("")
                setFormLabel("")
            }
        } catch (error) {
            console.error("Failed to add email:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleEdit = async () => {
        if (!editingEmail || !formEmail.trim()) return
        setIsLoading(true)
        try {
            const res = await fetch(`/api/client/emails/${editingEmail.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: formEmail, label: formLabel || null }),
            })
            if (res.ok) {
                await refreshEmails()
                setIsEditDialogOpen(false)
                setEditingEmail(null)
                setFormEmail("")
                setFormLabel("")
            }
        } catch (error) {
            console.error("Failed to edit email:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!deletingEmail) return
        setIsLoading(true)
        try {
            const res = await fetch(`/api/client/emails/${deletingEmail.id}`, {
                method: "DELETE",
            })
            if (res.ok) {
                await refreshEmails()
                setIsDeleteDialogOpen(false)
                setDeletingEmail(null)
            }
        } catch (error) {
            console.error("Failed to delete email:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const openEditDialog = (email: ClientEmailType) => {
        setEditingEmail(email)
        setFormEmail(email.email)
        setFormLabel(email.label || "")
        setIsEditDialogOpen(true)
    }

    const openDeleteDialog = (email: ClientEmailType) => {
        setDeletingEmail(email)
        setIsDeleteDialogOpen(true)
    }

    return (
        <div className="space-y-3">
            {/* Header with Add button */}
            <div className="flex items-center justify-between px-1">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                    Emails de Contato
                </p>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 gap-1"
                    onClick={() => setIsAddDialogOpen(true)}
                >
                    <Plus className="h-4 w-4" />
                    Adicionar
                </Button>
            </div>

            {/* Email List */}
            {emails.length > 0 ? (
                <div className="space-y-2">
                    {emails.map((email) => (
                        <div
                            key={email.id}
                            className="flex items-center gap-3 p-4 rounded-xl bg-muted/50"
                        >
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                <Mail className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                                {email.label && (
                                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                                        {email.label}
                                    </p>
                                )}
                                <p className="text-sm font-medium truncate">{email.email}</p>
                            </div>

                            {/* Actions Menu */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => openEditDialog(email)}>
                                        <Pencil className="mr-2 h-4 w-4" />
                                        Editar
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => openDeleteDialog(email)}
                                        className="text-destructive"
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Excluir
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="p-4 rounded-xl bg-muted/30 text-center">
                    <p className="text-sm text-muted-foreground">
                        Nenhum email cadastrado
                    </p>
                </div>
            )}

            {/* Add Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Adicionar Email</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="email@exemplo.com"
                                value={formEmail}
                                onChange={(e) => setFormEmail(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="label">Categoria (opcional)</Label>
                            <Input
                                id="label"
                                placeholder="Ex: Financeiro, Técnico"
                                value={formLabel}
                                onChange={(e) => setFormLabel(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={handleAdd} disabled={isLoading || !formEmail.trim()}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Adicionar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar Email</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-email">Email</Label>
                            <Input
                                id="edit-email"
                                type="email"
                                value={formEmail}
                                onChange={(e) => setFormEmail(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-label">Categoria (opcional)</Label>
                            <Input
                                id="edit-label"
                                placeholder="Ex: Financeiro, Técnico"
                                value={formLabel}
                                onChange={(e) => setFormLabel(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={handleEdit} disabled={isLoading || !formEmail.trim()}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Salvar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Excluir Email</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-muted-foreground py-4">
                        Tem certeza que deseja excluir{" "}
                        <strong>{deletingEmail?.email}</strong>?
                    </p>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            Cancelar
                        </Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Excluir
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
