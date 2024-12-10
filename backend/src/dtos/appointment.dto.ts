// src/dtos/appointment.dto.ts
import { AppointmentStatus } from '../types/enums';

/**
 * DTO para la creación de citas médicas
 * Define la estructura para programar una nueva cita
 */
export interface CreateAppointmentDTO {
    paciente_id: string;
    medico_id: string;
    fecha_hora: Date; // Formato ISO 8601: YYYY-MM-DDTHH:mm:ss.sssZ
    motivo: string;
    notas?: string;
}

/**
 * DTO para la actualización de citas
 * Permite modificar detalles de la cita y su estado
 */
export interface UpdateAppointmentDTO {
    fecha_hora?: string;
    motivo?: string;
    estado?: AppointmentStatus;
    notas?: string;
}