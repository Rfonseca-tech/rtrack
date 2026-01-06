"use client"

import * as React from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Paperclip, ChevronDown, ChevronUp, FileText, Download } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

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
 * ActivityCard - Chat-like card for displaying service activities
 * 
 * Features:
 * - Responsible person as "sender"
 * - Content of the activity
 * - Date/time in bottom right
 * - Attachment indicator if documents
 * - Expandable details section
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
                "relative p-4 rounded-xl border bg-card",
                "transition-all duration-200",
                hasExpandableContent && "cursor-pointer hover:border-primary/30",
                expanded && "ring-1 ring-primary/20"
            )}
            onClick={() => hasExpandableContent && setExpanded(!expanded)}
        >
            {/* Header: Avatar + Name */}
            <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary text-sm font-medium shrink-0">
                    {initials}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    {/* Name */}
                    <p className="font-medium text-sm">{responsibleName}</p>

                    {/* Activity content */}
                    <p className="text-sm text-foreground/80 mt-1 leading-relaxed">
                        {content}
                    </p>

                    {/* Attachments indicator */}
                    {documents && documents.length > 0 && !expanded && (
                        <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                            <Paperclip className="h-3 w-3" />
                            <span>
                                {documents.length} {documents.length === 1 ? "anexo" : "anexos"}
                            </span>
                        </div>
                    )}

                    {/* Date/Time - Bottom right */}
                    <div className="flex items-center justify-between mt-3">
                        {hasExpandableContent && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2 text-xs text-muted-foreground"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setExpanded(!expanded)
                                }}
                            >
                                {expanded ? (
                                    <>
                                        <ChevronUp className="h-3 w-3 mr-1" />
                                        Menos
                                    </>
                                ) : (
                                    <>
                                        <ChevronDown className="h-3 w-3 mr-1" />
                                        Detalhes
                                    </>
                                )}
                            </Button>
                        )}
                        <span className="text-xs text-muted-foreground ml-auto">
                            {format(date, "dd/MM HH:mm", { locale: ptBR })}
                        </span>
                    </div>
                </div>
            </div>

            {/* Expanded content */}
            {expanded && hasExpandableContent && (
                <div className="mt-4 pt-4 border-t space-y-4" onClick={(e) => e.stopPropagation()}>
                    {/* Details */}
                    {(details || status || deadline) && (
                        <div className="space-y-2">
                            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Detalhes
                            </h4>
                            {status && (
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="text-muted-foreground">Status:</span>
                                    <span className="font-medium">{status}</span>
                                </div>
                            )}
                            {deadline && (
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="text-muted-foreground">Prazo:</span>
                                    <span className="font-medium">
                                        {format(deadline, "dd/MM/yyyy", { locale: ptBR })}
                                    </span>
                                </div>
                            )}
                            {details && (
                                <p className="text-sm text-foreground/80">{details}</p>
                            )}
                        </div>
                    )}

                    {/* Documents */}
                    {documents && documents.length > 0 && (
                        <div className="space-y-2">
                            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
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
                                            "flex items-center gap-3 p-3 rounded-lg border",
                                            "hover:bg-muted/50 transition-colors",
                                            "touch-target"
                                        )}
                                    >
                                        <FileText className="h-5 w-5 text-muted-foreground" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{doc.name}</p>
                                            {doc.size && (
                                                <p className="text-xs text-muted-foreground">{doc.size}</p>
                                            )}
                                        </div>
                                        <Download className="h-4 w-4 text-muted-foreground" />
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
