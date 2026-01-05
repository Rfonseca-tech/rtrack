"use client"

import * as React from "react"
import { CommandPalette } from "@/components/command-palette/command-palette"

export function CommandPaletteProvider({ children, role }: { children: React.ReactNode, role?: string }) {
    const [open, setOpen] = React.useState(false)

    return (
        <>
            <CommandPalette open={open} onOpenChange={setOpen} role={role} />
            {children}
        </>
    )
}
