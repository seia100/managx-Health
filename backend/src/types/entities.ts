// src/types/entities.ts
import { UserRole, BloodType,AppointmentStatus } from "./enums";

/**
 * Interfaces que definen la estructura de las entidades principales
 * de la base de datos. Incluyen todos los campos y sus tipos.
 */
export interface BaseEntity {
    id: string;
    created_at: Date;
    updated_at: Date;
}

export interface User extends BaseEntity {
    nombre: string;
    email: string;
    password_hash: string;
    rol: UserRole;
    ultimo_acceso: Date | null;
    activo: boolean;
    intentos_fallidos: number;
}

export interface Patient extends BaseEntity {
    nombre: string;
    fecha_nacimiento: Date;
    direccion: string;
    telefono: string;
    email: string | null;
    tipo_sangre: BloodType;
    alergias: string[];
}

export interface MedicalHistory extends BaseEntity {
    paciente_id: string;
    medico_id: string;
    descripcion: string;
    fecha: Date;
    diagnostico: string;
    tratamiento: string;
    archivos_adjuntos: Record<string, any>;
}

export interface Appointment extends BaseEntity {
    paciente_id: string;
    medico_id: string;
    fecha_hora: Date;
    motivo: string;
    estado: AppointmentStatus;
    notas: string | null;
}