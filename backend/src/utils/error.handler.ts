// src/utils/error.handler.ts

import { Response } from 'express';

/**
 * @theoreticalBackground
 * Manejo centralizado de errores:
 * - Estandarización de respuestas de error
 * - Separación de lógica de error
 * - Facilita el debugging y monitoreo
 */
export class ErrorHandler extends Error {
    statusCode: number;
    message: string;

    constructor(statusCode: number, message: string) {
        super();
        this.statusCode = statusCode;
        this.message = message;
    }

    /**
     * Maneja el error y envía una respuesta estandarizada
     * @param error Error a manejar
     * @param res Objeto de respuesta Express
     */
    public static handleError(error: any, res: Response): void {
        if (error instanceof ErrorHandler) {
            res.status(error.statusCode).json({
                status: 'error',
                statusCode: error.statusCode,
                message: error.message
            });
        } else {
            // Error no controlado
            console.error('Error no controlado:', error);
            res.status(500).json({
                status: 'error',
                statusCode: 500,
                message: 'Error interno del servidor'
            });
        }
    }
}

// Middleware de manejo de errores para Express
export const errorMiddleware = (error: any, res: Response): void => {
    ErrorHandler.handleError(error, res);
};