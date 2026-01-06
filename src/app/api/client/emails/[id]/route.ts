import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/infrastructure/database/prisma"
import { getCurrentUserWithRole } from "@/lib/auth-utils"

export const dynamic = "force-dynamic"

interface RouteParams {
    params: Promise<{ id: string }>
}

// Update an email
export async function PUT(request: NextRequest, { params }: RouteParams) {
    const { id } = await params
    const user = await getCurrentUserWithRole()

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get client by email domain
    const userEmailDomain = user.email?.split("@")[1] || ""
    const client = await prisma.client.findFirst({
        where: { emailDomain: userEmailDomain },
    })

    if (!client) {
        return NextResponse.json({ error: "Client not found" }, { status: 404 })
    }

    // Verify the email belongs to this client
    const existingEmail = await prisma.clientEmail.findFirst({
        where: { id, clientId: client.id },
    })

    if (!existingEmail) {
        return NextResponse.json({ error: "Email not found" }, { status: 404 })
    }

    const body = await request.json()
    const { email, label, isPrimary } = body

    // If setting as primary, unset all others
    if (isPrimary) {
        await prisma.clientEmail.updateMany({
            where: { clientId: client.id, id: { not: id } },
            data: { isPrimary: false },
        })
    }

    const updatedEmail = await prisma.clientEmail.update({
        where: { id },
        data: {
            email: email !== undefined ? email : existingEmail.email,
            label: label !== undefined ? label : existingEmail.label,
            isPrimary: isPrimary !== undefined ? isPrimary : existingEmail.isPrimary,
        },
    })

    return NextResponse.json({ email: updatedEmail })
}

// Delete an email
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    const { id } = await params
    const user = await getCurrentUserWithRole()

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get client by email domain
    const userEmailDomain = user.email?.split("@")[1] || ""
    const client = await prisma.client.findFirst({
        where: { emailDomain: userEmailDomain },
    })

    if (!client) {
        return NextResponse.json({ error: "Client not found" }, { status: 404 })
    }

    // Verify the email belongs to this client
    const existingEmail = await prisma.clientEmail.findFirst({
        where: { id, clientId: client.id },
    })

    if (!existingEmail) {
        return NextResponse.json({ error: "Email not found" }, { status: 404 })
    }

    await prisma.clientEmail.delete({ where: { id } })

    return NextResponse.json({ success: true })
}
