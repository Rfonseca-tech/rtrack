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
import { login, AuthState } from "@/app/auth/actions"
import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"

const initialState: AuthState = {}

export function LoginForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {
    const [state, formAction, isPending] = useActionState(login, initialState)

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>
                        Entre com seu email para acessar o sistema
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
                                    <a
                                        href="#"
                                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                    >
                                        Esqueceu a senha?
                                    </a>
                                </div>
                                <Input id="password" name="password" type="password" required />
                            </div>
                            <Button type="submit" className="w-full" disabled={isPending}>
                                {isPending ? "Entrando..." : "Entrar"}
                            </Button>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            Não tem uma conta?{" "}
                            <Link href="/register" className="underline underline-offset-4">
                                Cadastre-se (apenas admin)
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
            <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
                Ao clicar em continuar, você concorda com nossos <a href="#">Termos de Serviço</a> e <a href="#">Política de Privacidade</a>.
            </div>
        </div>
    )
}
