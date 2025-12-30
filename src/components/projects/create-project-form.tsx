'use client'

import { createProject } from "@/app/dashboard/projects/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"

// Define types for props
interface ClientOption {
    id: string
    razaoSocial: string
}

interface FamilyOption {
    code: string
    name: string
    area: {
        name: string
    } | null
}

interface CreateProjectFormProps {
    clients: ClientOption[]
    families: FamilyOption[]
}

export function CreateProjectForm({ clients, families }: CreateProjectFormProps) {
    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Novo Projeto</CardTitle>
            </CardHeader>
            <form action={createProject}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nome do Projeto</Label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="Ex: Consultoria Societária 2024"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="clientId">Cliente</Label>
                        <Select name="clientId" required>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione um cliente" />
                            </SelectTrigger>
                            <SelectContent>
                                {clients.map((client) => (
                                    <SelectItem key={client.id} value={client.id}>
                                        {client.razaoSocial}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="familyCode">Família de Produto</Label>
                        <Select name="familyCode" required>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione a família do produto" />
                            </SelectTrigger>
                            <SelectContent>
                                {families.map((family) => (
                                    <SelectItem key={family.code} value={family.code}>
                                        {family.code} - {family.name} {family.area ? `(${family.area.name})` : ""}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                            A família determina a Área responsável e o escopo macro do projeto.
                        </p>
                    </div>

                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline" type="button" onClick={() => window.history.back()}>Cancelar</Button>
                    <Button type="submit">Criar Projeto</Button>
                </CardFooter>
            </form>
        </Card>
    )
}
