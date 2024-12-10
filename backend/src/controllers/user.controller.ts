// src/controllers/user.controller.ts
import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import { UserService } from '../services/user.service';
import { TypedRequest } from './types';
import { UpdateUserDTO } from '@/dtos/user.dto';

export class UserController extends BaseController {
    private userService: UserService;

    constructor() {
        super();
        this.userService = new UserService();
    }

    public getProfile = async (
        req: Request,
        res: Response
    ): Promise<Response> => {
        try {
            const userId = req.params.id;
            const user = await this.userService.findById(userId);
            
            if (!user) {
                return BaseController.sendResponse(
                    res,
                    404,
                    false,
                    null,
                    'Usuario no encontrado'
                );
            }

            return BaseController.sendResponse(
                res,
                200,
                true,
                user,
                'Perfil recuperado exitosamente'
            );
        } catch (error) {
            return BaseController.handleError(res, error);
        }
    }

    public updateProfile = async (
        req: TypedRequest<UpdateUserDTO>,
        res: Response
    ): Promise<Response> => {
        try {
            const userId = req.params.id;
            const userData = req.body;
            const updatedUser = await this.userService.update(userId, userData);

            return BaseController.sendResponse(
                res,
                200,
                true,
                updatedUser,
                'Perfil actualizado exitosamente'
            );
        } catch (error) {
            return BaseController.handleError(res, error);
        }
    }

    public deleteUser = async (
        req: Request,
        res: Response
    ): Promise<Response> => {
        try {
            const userId = req.params.id;
            await this.userService.delete(userId);

            return BaseController.sendResponse(
                res,
                200,
                true,
                null,
                'Usuario eliminado exitosamente'
            );
        } catch (error) {
            return BaseController.handleError(res, error);
        }
    }
}
