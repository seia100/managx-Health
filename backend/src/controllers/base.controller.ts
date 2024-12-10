// src/controllers/base.controller.ts
import { Response } from 'express';
import { ApiResponse } from './types';
import { logger } from '@/utils/logger';

/**
 * Controlador base que proporciona métodos utilitarios para respuestas HTTP consistentes
 * y manejo de errores centralizado.
 */
export abstract class BaseController {
    protected static sendResponse<T>(
        res: Response,
        statusCode: number,
        success: boolean,
        data?: T,
        message?: string,
        error?: string
    ): Response<ApiResponse<T>> {
        return res.status(statusCode).json({
            success,
            data,
            message,
            error
        });
    }

    protected static handleError(res: Response, error: any): Response {
        logger.error('Error en el controlador:', error);

        if (error.name === 'ValidationError') {
            return this.sendResponse(
                res,
                400,
                false,
                null,
                'Error de validación',
                error.message
            );
        }

        if (error.code === '23505') { // PostgreSQL unique violation
            return this.sendResponse(
                res,
                409,
                false,
                null,
                'Conflicto de datos',
                'El recurso ya existe'
            );
        }

        return this.sendResponse(
            res,
            500,
            false,
            null,
            'Error interno del servidor',
            error.message
        );
    }
}