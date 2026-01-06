"use client"

import * as React from "react"
import { Loader2 } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { VariantProps } from "class-variance-authority"

type ButtonProps = React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
        asChild?: boolean
    }

interface LoadingButtonProps extends ButtonProps {
    /** Loading state - shows spinner and disables button */
    loading?: boolean
    /** Text to show while loading (optional) */
    loadingText?: string
}

/**
 * LoadingButton - Button with integrated loading state
 * 
 * Features:
 * - Smooth transition to loading state
 * - Spinner icon replaces or accompanies text
 * - Automatically disabled while loading
 * - Optional loading text
 */
export function LoadingButton({
    loading = false,
    loadingText,
    children,
    disabled,
    className,
    ...props
}: LoadingButtonProps) {
    return (
        <Button
            disabled={disabled || loading}
            className={cn(
                "relative",
                loading && "cursor-not-allowed",
                className
            )}
            {...props}
        >
            {loading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {loading && loadingText ? loadingText : children}
        </Button>
    )
}
