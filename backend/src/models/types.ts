// src/models/types.ts
import { Pool, QueryResult } from 'pg';

// Interfaz base para todos los modelos
export interface BaseModel {
    id: string;
    created_at: Date;
    updated_at: Date;
}

// Tipo genérico para resultados de consultas
export type QueryResultRow<T> = T & Record<string, any>;

// Interface base para operaciones CRUD
export interface CrudOperations<T> {
    create(data: Partial<T>): Promise<T>;
    findById(id: string): Promise<T | null>;
    update(id: string, data: Partial<T>): Promise<T | null>;
    delete(id: string): Promise<boolean>;
}