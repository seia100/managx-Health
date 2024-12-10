// src/types/responses.ts

import { User } from "./entities";
/**
 * Interfaces para tipar las respuestas de la API.
 * Aseguran consistencia en el formato de respuestas.
 */
export interface ApiResponse<T> {
    success: boolean;
    data: T | null;
    message?: string;
    error?: string;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface AuthResponse {
    user: Omit<User, 'password_hash'>;
    token: string;
}