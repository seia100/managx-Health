// src/middleware/auth.middleware.ts
import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from './types';
import { APP_CONSTANTS } from '@/config/constants';
import { logger } from '@/utils/logger';

/**
 * Middleware para la autenticación de usuarios mediante JWT
 * Verifica el token en los headers y lo decodifica para obtener la información del usuario
 */
export class AuthMiddleware {
    public static async authenticate(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void | Response> {
        try {
            // Obtener el token del header
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({
                    success: false,
                    message: 'Token no proporcionado'
                });
            }

            // Extraer y verificar el token
            const token = authHeader.split(' ')[1];
            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: 'Token no válido'
                });
            }

            try {
                // Verificar y decodificar el token
                const decoded = jwt.verify(
                    token,
                    process.env.JWT_SECRET || 'your_jwt_secret'
                ) as AuthenticatedRequest['user'];

                // Adjuntar la información del usuario al request
                req.user = decoded;
                next();
            } catch (error) {
                logger.error('Error al verificar token:', error);
                return res.status(401).json({
                    success: false,
                    message: 'Token inválido o expirado'
                });
            }
        } catch (error) {
            logger.error('Error en autenticación:', error);
            return res.status(500).json({
                success: false,
                message: 'Error en la autenticación'
            });
        }
    }

    /**
     * Middleware para refrescar el token JWT antes de que expire
     * Útil para mantener la sesión activa en peticiones largas
     */
    public static async refreshToken(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void | Response> {
        try {
            if (!req.user) {
                return next();
            }

            const token = req.headers.authorization?.split(' ')[1];
            if (!token) {
                return next();
            }

            // Verificar si el token está próximo a expirar (menos de 1 hora)
            const decoded = jwt.decode(token) as { exp: number };
            const tokenExp = decoded.exp * 1000;
            const now = Date.now();
            const oneHour = 60 * 60 * 1000;

            if (tokenExp - now < oneHour) {
                // Generar nuevo token
                const newToken = jwt.sign(
                    { ...req.user },
                    process.env.JWT_SECRET || 'your_jwt_secret',
                    { expiresIn: '24h' }
                );

                // Enviar nuevo token en el header
                res.setHeader('New-Token', newToken);
            }

            next();
        } catch (error) {
            next();
        }
    }
}