// src/dtos/patient.dto.ts
import { BloodType } from '@/types/enums';

/**
 * DTO para la creación de pacientes
 * Incluye todos los campos requeridos para un nuevo paciente
 */
export interface CreatePatientDTO {
    nombre: string;
    fecha_nacimiento: string; // Formato ISO 8601: YYYY-MM-DD
    direccion: string;
    telefono: string;
    email?: string; // Opcional
    tipo_sangre: BloodType;
    alergias: string[];
}

/**
 * DTO para la actualización de pacientes
 * Todos los campos son opcionales para permitir actualizaciones parciales
 */
export interface UpdatePatientDTO {
    nombre?: string;
    direccion?: string;
    telefono?: string;
    email?: string;
    tipo_sangre?: BloodType;
    alergias?: string[];
}