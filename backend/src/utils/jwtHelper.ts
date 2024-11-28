// jwtHelper.t

// Importa la librería `jsonwebtoken` para manejar la generación y verificación de tokens JWT.
import jwt from 'jsonwebtoken';
// Importa las variables de entorno necesarias, incluida la clave secreta del JWT.
import { ENV } from '../config/env';

/**
 * Conjunto de utilidades para manejar tokens JWT.
 * Estas funciones encapsulan la lógica de generación y verificación de tokens, centralizando su uso.
 */
export default {
    /**
     * Genera un token JWT firmado con un payload personalizado.
     * @param payload - Objeto que contiene la información a incluir en el token (ej. userId, rol).
     * @returns Un token JWT firmado.
     */
    generateToken: (payload: object) => 
        jwt.sign(payload, ENV.JWT_SECRET, { expiresIn: '1h' }),

    /**
     * Verifica y decodifica un token JWT utilizando la clave secreta.
     * @param token - El token JWT a verificar.
     * @returns El payload decodificado si el token es válido.
     * @throws Error si el token es inválido o ha expirado.
     */
    verifyToken: (token: string) => 
        jwt.verify(token, ENV.JWT_SECRET),
};
