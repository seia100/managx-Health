// src/models/patient.model.ts
import { Model } from './base.model';
import { BaseModel } from './types';

export interface Patient extends BaseModel {
    nombre: string;
    fecha_nacimiento: Date;
    direccion: string;
    telefono: string;
    email: string | null;
    tipo_sangre: string;
    alergias: string[];
}

export class PatientModel extends Model<Patient> {
    constructor() {
        super('pacientes');
    }

    public async findByEmail(email: string): Promise<Patient | null> {
        const query = `
            SELECT * FROM ${this.tableName}
            WHERE email = $1
        `;

        const result = await this.executeQuery<Patient>(query, [email]);
        return result.rows[0] || null;
    }

    public async search(searchTerm: string): Promise<Patient[]> {
        const query = `
            SELECT * FROM ${this.tableName}
            WHERE nombre ILIKE $1 OR email ILIKE $1
            ORDER BY nombre
        `;

        const result = await this.executeQuery<Patient>(
            query,
            [`%${searchTerm}%`]
        );
        return result.rows;
    }

    public async findAll(limit: number, offset: number): Promise<Patient[]> {
        const query = `
            SELECT * FROM pacientes
            ORDER BY created_at DESC
            LIMIT $1 OFFSET $2
        `;
        const result = await this.executeQuery<Patient>(query, [limit, offset]);
        return result.rows;
    }

    public async count(): Promise<number> {
        const query = 'SELECT COUNT(*) as total FROM pacientes';
        const result = await this.executeQuery<{total: string}>(query);
        return parseInt(result.rows[0].total, 10);
    }
}