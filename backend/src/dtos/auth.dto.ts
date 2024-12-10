// src/dtos/auth.dto.ts
import { UserRole } from '../types/enums';

/**
 * DTO para el registro de usuarios
 * Incluye todos los campos necesarios para crear un nuevo usuario
 */
export interface RegisterDTO {
    nombre: string;
    email: string;
    password: string;
    rol: UserRole;
}

/**
 * DTO para el inicio de sesión
 * Solo requiere credenciales básicas
 */
export interface LoginDTO {
    email: string;
    password: string;
}