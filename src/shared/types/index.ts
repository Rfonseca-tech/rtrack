/**
 * Global Type Definitions for R|Track
 */

// Re-export Prisma types for convenience
export type { User, Area, Client, Product, ProductFamily, Project, Contract, Task, TaskTemplate, Document, AuditLog, ProjectCollaborator } from "@prisma/client";
export { UserRole, TaskStatus } from "@prisma/client";

// API Response Types
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

// Pagination Types
export interface PaginationParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// Auth Types
export interface AuthUser {
    id: string;
    email: string;
    name: string;
    role: "ROOT" | "ADMIN" | "EMPLOYEE" | "CLIENT";
    areaId?: string;
}

export interface Session {
    user: AuthUser;
    accessToken: string;
    expiresAt: number;
}
