'use client'

import { useState, useTransition } from 'react'
import { KeyRound, Trash2, UserX, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { resetUserPassword, hardDeleteUser, deactivateUser } from './actions'

interface UserActionsProps {
    userId: string
    userName: string
    isRoot: boolean
}

export function UserActions({ userId, userName, isRoot }: UserActionsProps) {
    const [isPending, startTransition] = useTransition()
    const [showPasswordDialog, setShowPasswordDialog] = useState(false)
    const [newPassword, setNewPassword] = useState<string | null>(null)
    const [copied, setCopied] = useState(false)

    const handleResetPassword = () => {
        if (confirm(`Tem certeza que deseja redefinir a senha de ${userName}?`)) {
            startTransition(async () => {
                const result = await resetUserPassword(userId)
                if (result.success && result.newPassword) {
                    setNewPassword(result.newPassword)
                    setShowPasswordDialog(true)
                } else {
                    alert(result.error || 'Erro ao redefinir senha')
                }
            })
        }
    }

    const handleDeactivate = () => {
        if (confirm(`Tem certeza que deseja desativar ${userName}?`)) {
            startTransition(async () => {
                const result = await deactivateUser(userId)
                if (!result.success) {
                    alert(result.message || 'Erro ao desativar usuário')
                }
            })
        }
    }

    const handleHardDelete = () => {
        if (confirm(`ATENÇÃO: Isso irá EXCLUIR PERMANENTEMENTE o usuário ${userName}. Esta ação não pode ser desfeita. Continuar?`)) {
            startTransition(async () => {
                const result = await hardDeleteUser(userId)
                if (!result.success) {
                    alert(result.error || 'Erro ao excluir usuário')
                }
            })
        }
    }

    const copyPassword = () => {
        if (newPassword) {
            navigator.clipboard.writeText(newPassword)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    return (
        <>
            <div className="flex items-center gap-1">
                {/* Reset Password - only ROOT */}
                {isRoot && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleResetPassword}
                        disabled={isPending}
                        className="h-8 w-8"
                        title="Redefinir Senha"
                    >
                        <KeyRound className="h-4 w-4" />
                    </Button>
                )}

                {/* Deactivate - ADMIN+ */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleDeactivate}
                    disabled={isPending}
                    className="h-8 w-8 text-yellow-600 hover:text-yellow-600"
                    title="Desativar Usuário"
                >
                    <UserX className="h-4 w-4" />
                </Button>

                {/* Hard Delete - only ROOT */}
                {isRoot && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleHardDelete}
                        disabled={isPending}
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        title="Excluir Permanentemente"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                )}
            </div>

            {/* Password Dialog */}
            <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Nova Senha Gerada</DialogTitle>
                        <DialogDescription>
                            Copie a nova senha temporária para {userName}. Ela não será exibida novamente.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                        <code className="text-lg font-mono flex-1">{newPassword}</code>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={copyPassword}
                        >
                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            {copied ? 'Copiado!' : 'Copiar'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
