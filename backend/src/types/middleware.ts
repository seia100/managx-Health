// src/types/middleware.ts

import { UserRole } from './enums';
/**
 * Tipos relacionados con los middleware de la aplicación.
 * Extienden los tipos base de Express para incluir datos personalizados.
 */
import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        email: string;
        rol: UserRole;
        [key: string]: any;
    };
}

export interface FileRequest extends Request {
    file?: {
        fieldname: string;
        originalname: string;
        encoding: string;
        mimetype: string;
        buffer: Buffer;
        size: number;
    };
}