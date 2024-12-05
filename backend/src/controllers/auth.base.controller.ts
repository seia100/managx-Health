// src/controllers/auth.base.controller.ts
import { Request, Response } from 'express';
import { ErrorHandler } from '../utils/error.handler';
import { BaseController } from './base.controller';
import { UserRole } from '../interfaces/user.interface';
// import @types;

export abstract class AuthBaseController extends BaseController {
    /**
     * Verifica que el usuario tenga uno de los roles permitidos
     * @param req Request de Express
     * @param allowedRoles Array de roles permitidos
     * @throws ErrorHandler si el usuario no tiene los permisos necesarios
     */
    protected checkRole(req: Request, allowedRoles: UserRole[]): void {
        const user = req.user;
        if (!user?.rol) {
            throw new ErrorHandler(401, 'Usuario no autenticado');
        }
    
        if (!allowedRoles.includes(user.rol)) {
            throw new ErrorHandler(403, 'No tiene permisos para esta acción');
        }
    }
    /**
     * Obtiene el ID del usuario autenticado de manera segura
     * @param req Request de Express
     * @throws ErrorHandler si el usuario no está autenticado
    */
    protected getAuthenticatedUserId(req: Request): string {
        if (!req.user) {
            throw new ErrorHandler(401, 'Usuario no autenticado');
        }
        return req.user.id;
    }


    /**
     * Verifica si el usuario es el propietario del recurso o un administrador
     * @param req Request de Express
     * @param resourceUserId ID del usuario propietario del recurso
     * @throws ErrorHandler si el usuario no tiene los permisos necesarios
     */
    protected checkOwnership(req: Request, resourceUserId: string): void {
        const user = req.user;
        if (!user?.id) {
            throw new ErrorHandler(401, 'Usuario no autenticado');
        }

        const isOwner = user.id === resourceUserId;
        const isAdmin = user.rol === UserRole.ADMINISTRADOR;

        if (!isOwner && !isAdmin) {
            throw new ErrorHandler(403, 'No tiene permisos para acceder a este recurso');
        }
    }

    /**
     * Verifica si el usuario está autenticado
     * @param req Request de Express
     * @throws ErrorHandler si el usuario no está autenticado
     */
    protected verifyAuthenticated(req: Request): void {
        if (!req.user?.id) {
            throw new ErrorHandler(401, 'Usuario no autenticado');
        }
    }
}