// src/middlewares/auth.middleware.ts

// Importa los tipos necesarios de Express para tipar las funciones middleware.
import { Request, Response, NextFunction } from 'express';
// Importa la librería `jsonwebtoken` para verificar y decodificar tokens JWT.
import jwt from 'jsonwebtoken';

import { ErrorHandler } from '../utils/error.handler';
import { UserRole } from '../interfaces/user.interface';
// import @types; // Importamos los tipos personalizados
/**
 * @theoreticalBackground
 * Seguridad basada en JWT:
 * - Token stateless para escalabilidad
 * - Verificación de roles para control de acceso
 * - Middleware de autenticación reutilizable
 */


export class AuthMiddleware {
    /**
     * Verifica el token JWT y añade el usuario a la request
     * @security
     * - Validación de token
     * - Decodificación segura
     * - Manejo de expiración
     */
    public static authenticate = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            
            if (!token) {
                throw new ErrorHandler(401, 'Token no proporcionado');
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
                id: string;
                email: string;
                rol: UserRole;
            };

            // Asignamos el usuario decodificado
            req.user = {
                id: decoded.id,
                email: decoded.email,
                rol: decoded.rol
            };
            
            next();
        } catch (error) {
            if (error instanceof jwt.JsonWebTokenError) {
                ErrorHandler.handleError(new ErrorHandler(401, 'Token inválido'), res);
            } else {
                ErrorHandler.handleError(error, res);
            }
        }
    };

    /**
     * Verifica los roles permitidos para acceder a la ruta
     * Asume que authenticate middleware ya se ejecutó
     */
    public static authorize = (roles: UserRole[]) => {
        return (req: Request, res: Response, next: NextFunction) => {
            try {
                // El middleware authenticate debe ejecutarse primero
                if (!req.user) {
                    throw new ErrorHandler(401, 'Usuario no autenticado');
                }

                if (!roles.includes(req.user.rol)) {
                    throw new ErrorHandler(403, 'No tiene permisos para esta acción');
                }
                next();
            } catch (error) {
                ErrorHandler.handleError(error, res);
            }
        };
    };
}

export default AuthMiddleware;