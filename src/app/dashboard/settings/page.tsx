import { Metadata } from 'next'
import { Settings } from 'lucide-react'

export const metadata: Metadata = {
    title: 'Configurações',
}

export default function SettingsPage() {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Configurações</h1>
            </div>

            <div className="rounded-md border bg-card p-8">
                <div className="flex flex-col items-center justify-center gap-4 text-center">
                    <Settings className="h-12 w-12 text-muted-foreground" />
                    <h2 className="text-lg font-semibold">Configurações do Sistema</h2>
                    <p className="text-sm text-muted-foreground max-w-md">
                        As configurações do sistema estarão disponíveis em breve.
                    </p>
                </div>
            </div>
        </div>
    )
}
