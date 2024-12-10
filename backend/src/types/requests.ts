// src/types/requests.ts

import { UserRole, BloodType } from './enums';
/**
 * Interfaces para tipar los datos de entrada en las peticiones HTTP.
 * Ayudan a validar los datos recibidos y proporcionan autocompletado.
 */
export interface RegisterUserRequest {
    nombre: string;
    email: string;
    password: string;
    rol: UserRole;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface CreatePatientRequest {
    nombre: string;
    fecha_nacimiento: string;
    direccion: string;
    telefono: string;
    email?: string;
    tipo_sangre: BloodType;
    alergias: string[];
}

export interface CreateMedicalHistoryRequest {
    paciente_id: string;
    descripcion: string;
    diagnostico: string;
    tratamiento: string;
    archivos_adjuntos?: Record<string, any>;
}

export interface CreateAppointmentRequest {
    paciente_id: string;
    medico_id: string;
    fecha_hora: string;
    motivo: string;
    notas?: string;
}