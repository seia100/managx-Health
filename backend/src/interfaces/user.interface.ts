// src/interfaces/user.interface.ts

/**
 * Enum que define los roles disponibles en el sistema
 * Esto nos ayuda a mantener consistencia y type-safety en toda la aplicación
 */
export enum UserRole {
    MEDICO = 'MEDICO',
    ENFERMERO = 'ENFERMERO',
    ADMINISTRADOR = 'ADMINISTRADOR'
}

/**
 * Interfaz principal de Usuario
 * Define la estructura completa de un usuario en el sistema
 */
export interface IUser {
    id: string;
    nombre: string;
    email: string;
    password_hash: string;
    rol: UserRole;
    fecha_registro: Date;
    ultimo_acceso?: Date;
    activo: boolean;
    intentos_fallidos: number;
}

/**
 * Interfaz para la creación de usuarios
 * Omite campos generados automáticamente y transforma password_hash en password
 */
export interface IUserCreate extends Omit<IUser, 'id' | 'fecha_registro' | 'ultimo_acceso' | 'activo' | 'intentos_fallidos' | 'password_hash'> {
    password: string;
}

/**
 * Interfaz para actualización de usuarios
 * Hace todos los campos opcionales excepto el id
 */
export interface IUserUpdate extends Partial<Omit<IUser, 'id' | 'password_hash'>> {
    password?: string;
}

/**
 * Interfaz para el login de usuarios
 * Solo requiere credenciales básicas
 */
export interface IUserLogin {
    email: string;
    password: string;
}