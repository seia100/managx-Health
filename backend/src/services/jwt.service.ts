// src/utils/jwt.service.ts
import jwt from 'jsonwebtoken';
import { User } from '../types/entities';
import { AuthenticationError } from '../utils/errors';
import { logger } from '../utils/logger';

export class JwtService {
    private readonly secret: string;
    private readonly expiresIn: string;

    constructor() {
        this.secret = process.env.JWT_SECRET || 'your_jwt_secret';
        this.expiresIn = process.env.JWT_EXPIRATION || '24h';
    }

    /**
     * Genera un token JWT a partir de los datos del usuario
     */
    public generateToken(user: User): string {
        try {
            const payload = {
                id: user.id,
                email: user.email,
                rol: user.rol
            };

            return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn });
        } catch (error) {
            logger.error('Error generando token JWT:', error);
            throw new AuthenticationError('Error al generar el token');
        }
    }

    /**
     * Verifica y decodifica un token JWT
     */
    public verifyToken(token: string): any {
        try {
            return jwt.verify(token, this.secret);
        } catch (error) {
            logger.error('Error verificando token JWT:', error);
            throw new AuthenticationError('Token inválido o expirado');
        }
    }

    /**
     * Decodifica un token JWT sin verificar la firma
     * Útil para obtener información del payload sin validar el token
     */
    public decodeToken(token: string): any {
        try {
            return jwt.decode(token);
        } catch (error) {
            logger.error('Error decodificando token JWT:', error);
            throw new AuthenticationError('Token malformado');
        }
    }
}