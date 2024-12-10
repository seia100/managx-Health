// src/services/auth.service.ts
import { UserModel, User } from '../models/user.model';
import { JwtService } from '@/utils/jwt.service';
import { AuthenticationError, ValidationError } from '../utils/errors';
import { logger } from '../utils/logger';
import { RegisterUserRequest } from '../types/requests';

export class AuthService {
    private userModel: UserModel;
    private jwtService: JwtService;

    constructor() {
        this.userModel = new UserModel();
        this.jwtService = new JwtService();
    }

    public async register(userData: RegisterUserRequest): Promise<User> {
        try {
            // Validar que el email existe
            if (!userData.email) {
                throw new ValidationError('El email es requerido');
            }

            // Verificar si el email ya está registrado
            const existingUser = await this.userModel.findByEmail(userData.email);
            if (existingUser) {
                throw new ValidationError('El email ya está registrado');
            }

            // Crear el nuevo usuario
            const newUser = await this.userModel.create({
                ...userData,
                activo: true,
                intentos_fallidos: 0
            });

            logger.info(`Usuario registrado exitosamente: ${newUser.email}`);
            return newUser;
        } catch (error) {
            logger.error('Error en registro de usuario:', error);
            throw error;
        }
    }

    public async login(email: string, password: string): Promise<{ user: User; token: string }> {
        try {
            const user = await this.userModel.findByEmail(email);
            if (!user) {
                throw new AuthenticationError('Credenciales inválidas');
            }

            // ... resto del código del login ...

            return { user, token };
        } catch (error) {
            logger.error('Error en login:', error);
            throw error;
        }
    }
}