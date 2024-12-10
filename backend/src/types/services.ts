// src/types/services.ts

import { AppointmentStatus } from "./enums";
/**
 * Interfaces que definen los contratos para los servicios.
 * Ayudan a mantener la consistencia en la implementación de servicios.
 */
export interface CrudOperations<T, CreateDTO, UpdateDTO> {
    create(data: CreateDTO): Promise<T>;
    findById(id: string): Promise<T | null>;
    update(id: string, data: UpdateDTO): Promise<T | null>;
    delete(id: string): Promise<boolean>;
}

export interface QueryOptions {
    page?: number;
    limit?: number;
    orderBy?: string;
    order?: 'ASC' | 'DESC';
}

export interface MedicalHistoryQueryOptions extends QueryOptions {
    startDate?: Date;
    endDate?: Date;
    medico_id?: string;
}

export interface AppointmentQueryOptions extends QueryOptions {
    startDate?: Date;
    endDate?: Date;
    status?: AppointmentStatus;
    medico_id?: string;
    paciente_id?: string;
}
