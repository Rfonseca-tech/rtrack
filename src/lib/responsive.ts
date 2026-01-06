"use client"

import * as React from "react"

/**
 * useMediaQuery - Custom hook for responsive breakpoint detection
 * 
 * Usage:
 * const isMobile = useMediaQuery("(max-width: 767px)")
 * const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1023px)")
 * const isDesktop = useMediaQuery("(min-width: 1024px)")
 */
export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = React.useState(false)

    React.useEffect(() => {
        const media = window.matchMedia(query)

        // Set initial value
        setMatches(media.matches)

        // Create listener
        const listener = (event: MediaQueryListEvent) => {
            setMatches(event.matches)
        }

        // Add listener
        media.addEventListener("change", listener)

        // Cleanup
        return () => media.removeEventListener("change", listener)
    }, [query])

    return matches
}

/**
 * Predefined breakpoint hooks
 */
export function useIsMobile(): boolean {
    return useMediaQuery("(max-width: 767px)")
}

export function useIsTablet(): boolean {
    return useMediaQuery("(min-width: 768px) and (max-width: 1023px)")
}

export function useIsDesktop(): boolean {
    return useMediaQuery("(min-width: 1024px)")
}

/**
 * Breakpoint values matching Tailwind defaults
 */
export const breakpoints = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    "2xl": 1536,
} as const

/**
 * CSS classes for touch-friendly interactions
 * Apply min-height/min-width of 44px for accessibility
 */
export const touchTargetClasses = {
    button: "min-h-[44px] min-w-[44px]",
    link: "min-h-[44px] inline-flex items-center",
    listItem: "min-h-[48px] py-3",
    iconButton: "h-11 w-11", // 44px
} as const

/**
 * Helper to hide elements on mobile
 */
export const hideOnMobile = "hidden md:block"
export const showOnlyOnMobile = "block md:hidden"

/**
 * Helper to stack items on mobile
 */
export const stackOnMobile = "flex flex-col md:flex-row"
export const reverseStackOnMobile = "flex flex-col-reverse md:flex-row"
