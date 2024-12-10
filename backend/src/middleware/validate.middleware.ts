
// src/middleware/validate.middleware.ts
import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { logger } from '@/utils/logger';

/**
 * Middleware para validación de datos de entrada
 * Utiliza Joi para validar los datos según esquemas predefinidos
 */
export class ValidateMiddleware {
    /**
     * Valida el cuerpo de la petición contra un esquema Joi
     * @param schema Esquema Joi para validación
     */
    public static validateBody(schema: Joi.Schema) {
        return async (
            req: Request,
            res: Response,
            next: NextFunction
        ): Promise<void | Response> => {
            try {
                await schema.validateAsync(req.body, { abortEarly: false });
                next();
            } catch (error) {
                if (error instanceof Joi.ValidationError) {
                    const errorDetails = error.details.map(detail => ({
                        message: detail.message,
                        path: detail.path
                    }));

                    return res.status(400).json({
                        success: false,
                        message: 'Error de validación',
                        errors: errorDetails
                    });
                }

                logger.error('Error en validación:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Error en la validación de datos'
                });
            }
        };
    }

    /**
     * Valida los parámetros de la petición contra un esquema Joi
     * @param schema Esquema Joi para validación
     */
    public static validateParams(schema: Joi.Schema) {
        return async (
            req: Request,
            res: Response,
            next: NextFunction
        ): Promise<void | Response> => {
            try {
                await schema.validateAsync(req.params, { abortEarly: false });
                next();
            } catch (error) {
                if (error instanceof Joi.ValidationError) {
                    const errorDetails = error.details.map(detail => ({
                        message: detail.message,
                        path: detail.path
                    }));

                    return res.status(400).json({
                        success: false,
                        message: 'Error de validación en parámetros',
                        errors: errorDetails
                    });
                }

                logger.error('Error en validación de parámetros:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Error en la validación de parámetros'
                });
            }
        };
    }

    /**
     * Valida los query params de la petición contra un esquema Joi
     * @param schema Esquema Joi para validación
     */
    public static validateQuery(schema: Joi.Schema) {
        return async (
            req: Request,
            res: Response,
            next: NextFunction
        ): Promise<void | Response> => {
            try {
                await schema.validateAsync(req.query, { abortEarly: false });
                next();
            } catch (error) {
                if (error instanceof Joi.ValidationError) {
                    const errorDetails = error.details.map(detail => ({
                        message: detail.message,
                        path: detail.path
                    }));

                    return res.status(400).json({
                        success: false,
                        message: 'Error de validación en query params',
                        errors: errorDetails
                    });
                }

                logger.error('Error en validación de query params:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Error en la validación de query params'
                });
            }
        };
    }
}