'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Copy, Check } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from '@/components/ui/alert'
import { createUserWithPassword, CreateUserResult } from '../actions'

interface NewUserFormProps {
    areas: { id: string; name: string }[]
    availableRoles: { value: string; label: string }[]
}

export function NewUserForm({ areas, availableRoles }: NewUserFormProps) {
    const [result, setResult] = useState<CreateUserResult | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [copied, setCopied] = useState(false)

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true)
        const res = await createUserWithPassword(formData)
        setResult(res)
        setIsSubmitting(false)
    }

    const copyPassword = () => {
        if (result?.tempPassword) {
            navigator.clipboard.writeText(result.tempPassword)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    // Show success message with password
    if (result?.success) {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/dashboard/settings/users">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold tracking-tight">Usuário Criado!</h1>
                </div>

                <Alert className="max-w-2xl bg-green-50 border-green-200">
                    <AlertTitle className="text-green-800">Usuário criado com sucesso!</AlertTitle>
                    <AlertDescription className="mt-4 space-y-4">
                        <p className="text-green-700">
                            Anote ou copie a senha temporária abaixo. Ela não será exibida novamente.
                        </p>
                        <div className="flex items-center gap-2 p-3 bg-white rounded-md border">
                            <code className="text-lg font-mono flex-1">{result.tempPassword}</code>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={copyPassword}
                                className="shrink-0"
                            >
                                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                {copied ? 'Copiado!' : 'Copiar'}
                            </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            O usuário deverá trocar a senha no primeiro acesso.
                        </p>
                    </AlertDescription>
                </Alert>

                <div className="flex gap-4">
                    <Button asChild>
                        <Link href="/dashboard/settings/users">Voltar para Usuários</Link>
                    </Button>
                    <Button variant="outline" onClick={() => setResult(null)}>
                        Criar Outro Usuário
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard/settings/users">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <h1 className="text-2xl font-bold tracking-tight">Novo Usuário</h1>
            </div>

            <div className="rounded-md border bg-card p-6 max-w-2xl">
                {result?.error && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertDescription>{result.error}</AlertDescription>
                    </Alert>
                )}

                <form action={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nome Completo</Label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="Nome do usuário"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="usuario@email.com"
                            required
                        />
                        <p className="text-xs text-muted-foreground">
                            Uma senha temporária será gerada automaticamente
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="role">Perfil de Acesso</Label>
                        <Select name="role" defaultValue="EMPLOYEE" required>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione o perfil" />
                            </SelectTrigger>
                            <SelectContent>
                                {availableRoles.map((role) => (
                                    <SelectItem key={role.value} value={role.value}>
                                        {role.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="areaId">Área</Label>
                        <Select name="areaId">
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione a área (opcional)" />
                            </SelectTrigger>
                            <SelectContent>
                                {areas.map((area) => (
                                    <SelectItem key={area.id} value={area.id}>
                                        {area.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Criando...' : 'Criar Usuário'}
                        </Button>
                        <Button type="button" variant="outline" asChild>
                            <Link href="/dashboard/settings/users">Cancelar</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
