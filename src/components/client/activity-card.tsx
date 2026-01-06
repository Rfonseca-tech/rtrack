"use client"

import * as React from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Paperclip, ChevronDown, ChevronUp, FileText, Download, Clock, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ActivityDocument {
    id: string
    name: string
    url: string
    size?: string
}

export interface ActivityCardProps {
    id: string
    responsibleName: string
    responsibleAvatar?: string
    content: string
    date: Date
    documents?: ActivityDocument[]
    details?: string
    status?: string
    deadline?: Date
}

/**
 * ActivityCard - Mobile-first chat-like card for service activities
 * 
 * Features:
 * - Large touch targets throughout
 * - Chat bubble style design
 * - Expandable details section
 * - Touch-friendly document list
 */
export function ActivityCard({
    id,
    responsibleName,
    responsibleAvatar,
    content,
    date,
    documents,
    details,
    status,
    deadline,
}: ActivityCardProps) {
    const [expanded, setExpanded] = React.useState(false)
    const hasExpandableContent = documents?.length || details || status || deadline

    // Get initials for avatar
    const initials = responsibleName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)

    return (
        <div
            className={cn(
                // Base card styles - Chat bubble effect
                "relative p-4 rounded-2xl border-2 bg-card",
                // Mobile-first spacing
                "min-h-[80px]",
                // Touch feedback
                "transition-all duration-150",
                hasExpandableContent && "active:bg-muted/30",
                expanded && "border-primary/30 shadow-md"
            )}
            onClick={() => hasExpandableContent && setExpanded(!expanded)}
        >
            {/* Header: Avatar + Name + Time */}
            <div className="flex items-start gap-3">
                {/* Avatar - Large for mobile */}
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary text-base font-semibold shrink-0">
                    {initials}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    {/* Name and Time row */}
                    <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold text-base">{responsibleName}</p>
                        <span className="text-xs text-muted-foreground shrink-0">
                            {format(date, "dd/MM HH:mm", { locale: ptBR })}
                        </span>
                    </div>

                    {/* Activity content - Larger text for readability */}
                    <p className="text-base text-foreground/90 mt-2 leading-relaxed">
                        {content}
                    </p>

                    {/* Bottom row: Attachments + Expand button */}
                    <div className="flex items-center justify-between mt-3 pt-2">
                        {/* Attachments indicator */}
                        {documents && documents.length > 0 && !expanded && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Paperclip className="h-4 w-4" />
                                <span>
                                    {documents.length} {documents.length === 1 ? "anexo" : "anexos"}
                                </span>
                            </div>
                        )}

                        {/* Expand button - Large touch target */}
                        {hasExpandableContent && (
                            <button
                                type="button"
                                className={cn(
                                    "ml-auto flex items-center gap-1.5 px-4 py-2 rounded-full",
                                    "text-sm font-medium text-muted-foreground",
                                    "bg-muted/50 active:bg-muted transition-colors",
                                    "min-h-[40px]"
                                )}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setExpanded(!expanded)
                                }}
                            >
                                {expanded ? (
                                    <>
                                        <ChevronUp className="h-4 w-4" />
                                        Menos
                                    </>
                                ) : (
                                    <>
                                        <ChevronDown className="h-4 w-4" />
                                        Ver mais
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Expanded content */}
            {expanded && hasExpandableContent && (
                <div
                    className="mt-4 pt-4 border-t space-y-4"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Status and Deadline */}
                    {(status || deadline) && (
                        <div className="grid grid-cols-2 gap-3">
                            {status && (
                                <div className="p-3 rounded-xl bg-muted/50">
                                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                        <CheckCircle2 className="h-4 w-4" />
                                        <span className="text-xs font-medium uppercase tracking-wider">Status</span>
                                    </div>
                                    <p className="text-sm font-semibold">{status}</p>
                                </div>
                            )}
                            {deadline && (
                                <div className="p-3 rounded-xl bg-muted/50">
                                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                        <Clock className="h-4 w-4" />
                                        <span className="text-xs font-medium uppercase tracking-wider">Prazo</span>
                                    </div>
                                    <p className="text-sm font-semibold">
                                        {format(deadline, "dd/MM/yyyy", { locale: ptBR })}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Additional details */}
                    {details && (
                        <div className="p-3 rounded-xl bg-muted/30">
                            <p className="text-sm text-foreground/80 leading-relaxed">{details}</p>
                        </div>
                    )}

                    {/* Documents - Large touch targets */}
                    {documents && documents.length > 0 && (
                        <div className="space-y-2">
                            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-1">
                                Anexos
                            </h4>
                            <div className="space-y-2">
                                {documents.map((doc) => (
                                    <a
                                        key={doc.id}
                                        href={doc.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={cn(
                                            "flex items-center gap-4 p-4 rounded-xl border-2",
                                            "bg-card active:bg-muted transition-colors",
                                            "min-h-[64px]" // Large touch target
                                        )}
                                    >
                                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                                            <FileText className="h-5 w-5 text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{doc.name}</p>
                                            {doc.size && (
                                                <p className="text-xs text-muted-foreground">{doc.size}</p>
                                            )}
                                        </div>
                                        <Download className="h-5 w-5 text-muted-foreground shrink-0" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
