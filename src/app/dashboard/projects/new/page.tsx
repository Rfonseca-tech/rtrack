import { prisma } from "@/infrastructure/database/prisma"
import { CreateProjectForm } from "@/components/projects/create-project-form"
import { redirect } from "next/navigation"
import { createClient } from "@/infrastructure/auth/supabase-server"
import { getCurrentUserWithRole } from "@/lib/auth-utils"
import { canCreateProject } from "@/lib/permissions"

export default async function NewProjectPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const currentUser = await getCurrentUserWithRole()

    if (!user || (currentUser && !canCreateProject(currentUser.role))) {
        redirect('/dashboard/projects')
    }

    const clients = await prisma.client.findMany({
        select: {
            id: true,
            razaoSocial: true
        },
        orderBy: {
            razaoSocial: 'asc'
        }
    })

    const families = await prisma.productFamily.findMany({
        select: {
            code: true,
            name: true,
            area: {
                select: {
                    name: true
                }
            }
        },
        orderBy: {
            code: 'asc'
        }
    })

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Novo Projeto</h2>
            </div>
            <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
                <CreateProjectForm clients={clients} families={families} />
            </div>
            <div className="md:hidden p-4">
                <CreateProjectForm clients={clients} families={families} />
            </div>
        </div>
    )
}
