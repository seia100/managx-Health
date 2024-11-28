// validationMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

/**
 * Middleware para validar el cuerpo de una solicitud según un esquema definido.
 * @param schema Esquema de validación de Joi.
 */
export const validateBody = (schema: Joi.ObjectSchema) => (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        const details = error.details.map((detail) => detail.message);
        return res.status(400).json({ message: 'Datos inválidos', details });
    }

    next();
};

/**
 * Middleware para validar parámetros de la ruta.
 * @param schema Esquema de validación de Joi.
 */
export const validateParams = (schema: Joi.ObjectSchema) => (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.params, { abortEarly: false });

    if (error) {
        const details = error.details.map((detail) => detail.message);
        return res.status(400).json({ message: 'Parámetros inválidos', details });
    }

    next();
};
