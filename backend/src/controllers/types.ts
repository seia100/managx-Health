// src/controllers/types.ts
import { Request, Response } from 'express';

// Interfaces base para las respuestas de la API
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

// Tipos personalizados para Request con parámetros tipados
export interface TypedRequest<T = {}> extends Request {
    body: T;
}