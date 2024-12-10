// src/middleware/rbac.middleware.ts
import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './types';
import { APP_CONSTANTS } from '@/config/constants';
import { logger } from '@/utils/logger';

/**
 * Middleware para el Control de Acceso Basado en Roles (RBAC)
 * Verifica si el usuario tiene los permisos necesarios para acceder a un recurso
 */
export class RBACMiddleware {
    /**
     * Verifica si el usuario tiene uno de los roles permitidos
     * @param allowedRoles Array de roles permitidos
     */
    public static checkRole(allowedRoles: string[]) {
        return async (
            req: AuthenticatedRequest,
            res: Response,
            next: NextFunction
        ): Promise<void | Response> => {
            try {
                if (!req.user) {
                    return res.status(401).json({
                        success: false,
                        message: 'Usuario no autenticado'
                    });
                }

                const userRole = req.user.role;
                if (!allowedRoles.includes(userRole)) {
                    return res.status(403).json({
                        success: false,
                        message: 'No tiene permisos para acceder a este recurso'
                    });
                }

                next();
            } catch (error) {
                logger.error('Error en verificación de rol:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Error en la verificación de permisos'
                });
            }
        };
    }

    /**
     * Verifica si el usuario tiene acceso a un recurso específico
     * Por ejemplo, si un médico intenta acceder a los datos de un paciente que no es suyo
     */
    public static checkResourceAccess(resourceType: string) {
        return async (
            req: AuthenticatedRequest,
            res: Response,
            next: NextFunction
        ): Promise<void | Response> => {
            try {
                if (!req.user) {
                    return res.status(401).json({
                        success: false,
                        message: 'Usuario no autenticado'
                    });
                }

                const userId = req.user.id;
                const userRole = req.user.role;
                const resourceId = req.params.id;

                // Los administradores tienen acceso total
                if (userRole === APP_CONSTANTS.ROLES.ADMIN) {
                    return next();
                }

                // Lógica específica por tipo de recurso
                switch (resourceType) {
                    case 'patient':
                        // Verificar si el médico tiene acceso al paciente
                        // Aquí deberías implementar la lógica de verificación
                        break;
                    case 'appointment':
                        // Verificar si el usuario está relacionado con la cita
                        // Aquí deberías implementar la lógica de verificación
                        break;
                    default:
                        return res.status(403).json({
                            success: false,
                            message: 'Tipo de recurso no válido'
                        });
                }

                next();
            } catch (error) {
                logger.error('Error en verificación de acceso a recurso:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Error en la verificación de acceso'
                });
            }
        };
    }
}