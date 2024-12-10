// src/dtos/user.dto.ts
import { UserRole } from '@/types/enums';

export interface UpdateUserDTO {
    nombre?: string;
    email?: string;
    password?: string;
    rol?: UserRole;
    activo?: boolean;
}

export interface CreateUserDTO {
    nombre: string;
    email: string;
    password: string;
    rol: UserRole;
}