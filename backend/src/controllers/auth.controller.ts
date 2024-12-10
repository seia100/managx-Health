// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import { AuthService } from '@/services/auth.service';
import { TypedRequest } from './types';
import { LoginDTO, RegisterDTO } from '@/dtos/auth.dto';

export class AuthController extends BaseController {
    private authService: AuthService;

    constructor() {
        super();
        this.authService = new AuthService();
    }

    public register = async (
        req: TypedRequest<RegisterDTO>,
        res: Response
    ): Promise<Response> => {
        try {
            const userData = req.body;
            const newUser = await this.authService.register(userData);
            
            return BaseController.sendResponse(
                res,
                201,
                true,
                newUser,
                'Usuario registrado exitosamente'
            );
        } catch (error) {
            return BaseController.handleError(res, error);
        }
    }

    public login = async (
        req: TypedRequest<LoginDTO>,
        res: Response
    ): Promise<Response> => {
        try {
            const { email, password } = req.body;
            const authData = await this.authService.login(email, password);
            
            return BaseController.sendResponse(
                res,
                200,
                true,
                authData,
                'Inicio de sesión exitoso'
            );
        } catch (error) {
            return BaseController.handleError(res, error);
        }
    }
}
