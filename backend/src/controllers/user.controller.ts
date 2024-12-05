// src/controllers/user.controller.ts

// src/controllers/user.controller.ts
import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { validateUser } from '../validators/user.validator';
import { IUserCreate, IUserLogin, IUserUpdate, UserRole} from '../interfaces/user.interface';
import { ErrorHandler } from '../utils/error.handler';
import { AuthBaseController } from './auth.base.controller';
// import @types;

/**
 * @class UserController
 * @extends AuthBaseController
 * @description Controlador para la gestión de usuarios con seguridad mejorada y
 * manejo de autenticación robusto
 */
export class UserController extends AuthBaseController {
    private userService: UserService;

    constructor() {
        super();
        this.userService = new UserService();
    }

    /**
     * Registra un nuevo usuario
     * @security
     * - Validación de datos de entrada
     * - Hash de contraseña
     * - Verificación de email único
     */
    public register = async (req: Request, res: Response): Promise<void> => {
        try {
            const userData: IUserCreate = req.body;
            
            const { error } = validateUser(userData);
            if (error) {
                throw new ErrorHandler(400, error.details[0].message);
            }

            const newUser = await this.userService.createUser(userData);
            
            this.handleSuccess(
                res,
                { user: newUser },
                201,
                'Usuario registrado exitosamente'
            );
        } catch (error) {
            this.handleError(res, error);
        }
    };

    /**
     * Inicia sesión de usuario
     * @security
     * - Validación de credenciales
     * - Generación de JWT
     * - Actualización de último acceso
     */
    public login = async (req: Request, res: Response): Promise<void> => {
        try {
            const loginData: IUserLogin = req.body;
            const { token, user } = await this.userService.loginUser(loginData);

            this.handleSuccess(
                res,
                { token, user },
                200,
                'Inicio de sesión exitoso'
            );
        } catch (error) {
            this.handleError(res, error);
        }
    };


    /**
     * Obtiene el perfil de usuario
     * @security
     * - Verificación de JWT
     * - Verificación de permisos
     */
    public getProfile = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.params.id;
            
            // Verificar autenticación
            this.getAuthenticatedUserId(req);            
            const user = await this.userService.getUserById(userId);
            
            this.handleSuccess(res, { user }, 200);
        } catch (error) {
            this.handleError(res, error);
        }
    };
    
    
    /**
     * Actualiza el perfil de usuario
     * @security
     * - Verificación de propiedad del perfil
     * - Validación de datos actualizables
     */

    public updateProfile = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.params.id;
            const updateData: IUserUpdate = req.body;

            // Verificar propiedad del perfil usando el método del AuthBaseController
            this.checkOwnership(req, userId);

            const updatedUser = await this.userService.updateUser(userId, updateData);
            
            this.handleSuccess(
                res,
                { user: updatedUser },
                200,
                'Perfil actualizado exitosamente'
            );
        } catch (error) {
            this.handleError(res, error);
        }
    };

    /**
     * Elimina un usuario
     * @security
     * - Solo administradores
     * - Verificación de existencia
     */
    public deleteUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.params.id;
            
            // Verificar rol de administrador usando el enum
            this.checkRole(req, [UserRole.ADMINISTRADOR]);
            
            await this.userService.deleteUser(userId);
            
            this.handleSuccess(
                res,
                null,
                200,
                'Usuario eliminado exitosamente'
            );
        } catch (error) {
            this.handleError(res, error);
        }
    };
}

export default new UserController();