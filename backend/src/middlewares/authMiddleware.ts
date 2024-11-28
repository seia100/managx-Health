// Importa los tipos necesarios de Express para tipar las funciones middleware.
import { Request, Response, NextFunction } from 'express';
// Importa la librería `jsonwebtoken` para verificar y decodificar tokens JWT.
import jwt from 'jsonwebtoken';
// Importa las variables de entorno, incluida la clave secreta para los JWT.
import { ENV } from '../config/env';

// Define una interfaz para el payload del token JWT, tipando las propiedades esperadas.
interface TokenPayload {
  userId: number; // ID del usuario
  rol: string; // Rol del usuario (ej. "admin", "user")
}

/**
 * Middleware para verificar si el usuario está autenticado.
 * Comprueba la presencia y validez de un token JWT en el encabezado de autorización.
 */
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    // Obtiene el encabezado `Authorization` de la solicitud.
    const authHeader = req.headers.authorization;

    // Verifica si el encabezado no está presente o no tiene el formato esperado (`Bearer <token>`).
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No autenticado. Token faltante o inválido.' });
    }

    // Extrae el token del encabezado dividiendo la cadena después de "Bearer ".
    const token = authHeader.split(' ')[1];

    try {
        // Verifica el token usando la clave secreta definida en las variables de entorno.
        const payload = jwt.verify(token, ENV.JWT_SECRET) as TokenPayload;

        // Almacena la información del token en `req.user` para que esté disponible en la solicitud.
        req.user = payload;

        // Continúa con la siguiente función middleware o controlador.
        next();
    } catch (err) {
        // Si el token es inválido o ha expirado, responde con un código 401.
        return res.status(401).json({ message: 'Token inválido o expirado.' });
    }
};

/**
 * Middleware para verificar si el usuario tiene uno de los roles requeridos.
 * @param roles - Lista de roles autorizados.
 * @returns Middleware que verifica el rol del usuario.
 */
export const hasRole = (roles: string[]) => (req: Request, res: Response, next: NextFunction) => {
    // Obtiene la información del usuario del token almacenado en `req.user`.
    const user = req.user as TokenPayload;

    // Verifica si el rol del usuario no está en la lista de roles permitidos.
    if (!roles.includes(user.rol)) {
        // Si el usuario no tiene el rol requerido, responde con un código 403.
        return res.status(403).json({ message: 'No autorizado para realizar esta acción.' });
    }

    // Continúa con la siguiente función middleware o controlador.
    next();
};
