import { Metadata } from 'next'
import { FileText } from 'lucide-react'

export const metadata: Metadata = {
    title: 'Documentos',
}

export default function DocumentsPage() {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Documentos</h1>
            </div>

            <div className="rounded-md border bg-card p-8">
                <div className="flex flex-col items-center justify-center gap-4 text-center">
                    <FileText className="h-12 w-12 text-muted-foreground" />
                    <h2 className="text-lg font-semibold">Nenhum documento encontrado</h2>
                    <p className="text-sm text-muted-foreground max-w-md">
                        Os documentos são anexados às tarefas dos projetos.
                        Acesse um projeto para ver e gerenciar seus documentos.
                    </p>
                </div>
            </div>
        </div>
    )
}
