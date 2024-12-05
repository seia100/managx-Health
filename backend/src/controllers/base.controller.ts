// src/controllers/base.controller.ts
import { Request, Response } from 'express';
import { ErrorHandler } from '../utils/error.handler';
import '../types'; // Importamos los tipos personalizados


export interface ResponseData {
    status: 'success' | 'error';
    data?: any;
    message?: string;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export abstract class BaseController {
    protected req!: Request;
    protected res!: Response;


    /**
     * Maneja una respuesta exitosa con formato estandarizado
     * @param res Objeto de respuesta Express
     * @param data Datos a enviar en la respuesta
     * @param statusCode Código de estado HTTP (default: 200)
     * @param message Mensaje opcional para incluir en la respuesta
     * @param pagination Información de paginación opcional
     */
    protected handleSuccess(
        res: Response,
        data?: any,
        statusCode: number = 200,
        message?: string,
        pagination?: ResponseData['pagination']
    ): void {
        const response: ResponseData = {
            status: 'success'
        };

        if (data !== undefined) {
            response.data = data;
        }

        if (message) {
            response.message = message;
        }

        if (pagination) {
            response.pagination = pagination;
        }

        res.status(statusCode).json(response);
    }


    /**
     * Maneja una respuesta estándar exitosa
     * @param res Objeto de respuesta Express
     * @param statusCode Código de estado HTTP
     * @param data Datos a enviar en la respuesta
     */
    protected handleResponse(res: Response, statusCode: number, data: any): void {
        res.status(statusCode).json({
            status: 'success',
            data,
        });
    }

    /**
     * Maneja un error utilizando el ErrorHandler
     * @param res Objeto de respuesta Express
     * @param error Error a manejar
     */
    protected handleError(res: Response, error: any): void {
        ErrorHandler.handleError(error, res);
    }


    /* Métodos de utilidad para el manejo de operaciones asíncronas */
    /**
     * Ejecuta una operación asíncrona con manejo de errores automático
     * @param operation Función asíncrona a ejecutar
     * @param errorMessage Mensaje de error por defecto
     */
    protected async executeOperation<T>(
        operation: () => Promise<T>,
        errorMessage: string = 'Error en la operación'
    ): Promise<T> {
        try {
            return await operation();
        } catch (error) {
            throw new ErrorHandler(
                error instanceof ErrorHandler ? error.statusCode : 500,
                error instanceof ErrorHandler ? error.message : errorMessage
            );
        }
    }

    /**
     * Valida la existencia de parámetros requeridos
     * @param params Objeto con los parámetros a validar
     * @param requiredParams Array de nombres de parámetros requeridos
     */
    protected validateRequiredParams(params: any, requiredParams: string[]): void {
        const missingParams = requiredParams.filter(param => !params[param]);
        
        if (missingParams.length > 0) {
            throw new ErrorHandler(
                400,
                `Parámetros faltantes: ${missingParams.join(', ')}`
            );
        }
    }

    /**
     * Verifica si el usuario actual tiene los roles requeridos
     * @param allowedRoles Roles permitidos para la operación
     */
    protected checkUserRole(allowedRoles: string[]): void {
        if (!this.req.user || !allowedRoles.includes(this.req.user.rol)) {
            throw new ErrorHandler(403, 'No tiene permisos para realizar esta operación');
        }
    }

    /**
     * Verifica si el usuario actual es el propietario del recurso o un administrador
     * @param resourceUserId ID del usuario propietario del recurso
     */
    protected checkOwnershipOrAdmin(resourceUserId: string): void {
        if (!this.req.user) {
            throw new ErrorHandler(401, 'Usuario no autenticado');
        }

        if (this.req.user.id !== resourceUserId && this.req.user.rol !== 'ADMINISTRADOR') {
            throw new ErrorHandler(403, 'No tiene permisos para acceder a este recurso');
        }
    }

    /**
     * Obtiene los parámetros de paginación de la solicitud
     * @param defaultLimit Límite por defecto de elementos por página
     * @param maxLimit Límite máximo permitido de elementos por página
     */
    protected getPaginationParams(defaultLimit: number = 10, maxLimit: number = 100): {
        page: number;
        limit: number;
        offset: number;
    } {
        const page = Math.max(1, parseInt(this.req.query.page as string) || 1);
        let limit = Math.min(
            maxLimit,
            Math.max(1, parseInt(this.req.query.limit as string) || defaultLimit)
        );

        return {
            page,
            limit,
            offset: (page - 1) * limit
        };
    }

    /**
     * Construye un objeto de filtros a partir de los query params
     * @param allowedFilters Array de nombres de filtros permitidos
     */
    protected getFiltersFromQuery(allowedFilters: string[]): Record<string, any> {
        const filters: Record<string, any> = {};
        
        for (const filter of allowedFilters) {
            if (this.req.query[filter] !== undefined) {
                filters[filter] = this.req.query[filter];
            }
        }

        return filters;
    }

    /**
     * Verifica y retorna un ID válido
     * @param id ID a validar
     * @param paramName Nombre del parámetro para el mensaje de error
     */
    protected validateId(id: string, paramName: string = 'ID'): string {
        if (!id.match(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/)) {
            throw new ErrorHandler(400, `${paramName} inválido`);
        }
        return id;
    }
}