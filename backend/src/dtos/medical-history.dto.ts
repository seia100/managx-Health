// src/dtos/medical-history.dto.ts
/**
 * DTO para la creación de historiales médicos
 * Incluye campos necesarios para un nuevo registro médico
 */
export interface CreateMedicalHistoryDTO {
    paciente_id: string;
    descripcion: string;
    diagnostico: string;
    tratamiento: string;
    archivos_adjuntos?: Record<string, any>; // Estructura flexible para adjuntos
}

/**
 * DTO para la actualización de historiales médicos
 * Permite actualizar campos específicos del historial
 */
export interface UpdateMedicalHistoryDTO {
    descripcion?: string;
    diagnostico?: string;
    tratamiento?: string;
    archivos_adjuntos?: Record<string, any>;
}
