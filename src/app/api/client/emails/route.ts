import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/infrastructure/database/prisma"
import { getCurrentUserWithRole } from "@/lib/auth-utils"

export const dynamic = "force-dynamic"

// Get all emails for the authenticated client
export async function GET() {
    const user = await getCurrentUserWithRole()

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get client by email domain
    const userEmailDomain = user.email?.split("@")[1] || ""
    const client = await prisma.client.findFirst({
        where: { emailDomain: userEmailDomain },
        include: { emails: { orderBy: { isPrimary: "desc" } } },
    })

    if (!client) {
        return NextResponse.json({ error: "Client not found" }, { status: 404 })
    }

    return NextResponse.json({ emails: client.emails })
}

// Add new email for the authenticated client
export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const { email, label, isPrimary } = body

    if (!email) {
        return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // If setting as primary, unset all others
    if (isPrimary) {
        await prisma.clientEmail.updateMany({
            where: { clientId: client.id },
            data: { isPrimary: false },
        })
    }

    const newEmail = await prisma.clientEmail.create({
        data: {
            clientId: client.id,
            email,
            label: label || null,
            isPrimary: isPrimary || false,
        },
    })

    return NextResponse.json({ email: newEmail }, { status: 201 })
}
