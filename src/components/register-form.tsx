"use client"

import { useActionState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signup, AuthState } from "@/app/auth/actions"
import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"

const initialState: AuthState = {}

export function RegisterForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {
    const [state, formAction, isPending] = useActionState(signup, initialState)

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Cadastro</CardTitle>
                    <CardDescription>
                        Crie sua conta para acessar o RTrack
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={formAction}>
                        <div className="flex flex-col gap-6">
                            {state.error && (
                                <Alert variant="destructive">
                                    <AlertDescription>{state.error}</AlertDescription>
                                </Alert>
                            )}
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nome Completo</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="Seu Nome"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Senha</Label>
                                </div>
                                <Input id="password" name="password" type="password" required />
                            </div>
                            <Button type="submit" className="w-full" disabled={isPending}>
                                {isPending ? "Cadastrando..." : "Cadastrar"}
                            </Button>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            Já tem uma conta?{" "}
                            <Link href="/login" className="underline underline-offset-4">
                                Entrar
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
