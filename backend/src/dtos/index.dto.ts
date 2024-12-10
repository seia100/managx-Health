// src/dtos/index.ts
/**
 * Archivo de barril (barrel file) que exporta todos los DTOs
 * Facilita la importación de múltiples DTOs en otros archivos
 */
export * from './auth.dto';
export * from './user.dto';
export * from './patient.dto';
export * from './medical-history.dto';
export * from './appointment.dto';

/**
 * Tipos comunes que pueden ser utilizados en múltiples DTOs
 */
export interface PaginationDTO {
    page?: number;
    limit?: number;
    orderBy?: string;
    order?: 'ASC' | 'DESC';
}

export interface DateRangeDTO {
    startDate?: string;
    endDate?: string;
}