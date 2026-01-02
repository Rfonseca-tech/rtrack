import { Metadata } from 'next'
import Link from 'next/link'
import { Users, MapPin, Building2 } from 'lucide-react'

import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { getCurrentUserWithRole } from '@/lib/auth-utils'
import { canManageData } from '@/lib/permissions'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
    title: 'Configurações',
}

export default async function SettingsPage() {
    const user = await getCurrentUserWithRole()

    if (!user || !canManageData(user.role)) {
        redirect('/dashboard')
    }

    const settingsCards = [
        {
            title: 'Áreas',
            description: 'Gerencie as áreas de atuação do escritório',
            icon: MapPin,
            href: '/dashboard/settings/areas',
        },
        {
            title: 'Usuários',
            description: 'Gerencie os usuários e seus acessos',
            icon: Users,
            href: '/dashboard/settings/users',
        },
    ]

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Configurações</h1>
                <p className="text-muted-foreground">
                    Gerencie as configurações do sistema
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {settingsCards.map((card) => {
                    const Icon = card.icon
                    return (
                        <Link key={card.href} href={card.href}>
                            <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
                                <CardHeader>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-primary/10 rounded-lg">
                                            <Icon className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">{card.title}</CardTitle>
                                            <CardDescription>{card.description}</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                            </Card>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
