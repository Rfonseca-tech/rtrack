"use client"

import * as React from "react"
import { CommandPalette } from "@/components/command-palette/command-palette"

export function CommandPaletteProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = React.useState(false)

    return (
        <>
            <CommandPalette open={open} onOpenChange={setOpen} />
            {children}
        </>
    )
}
