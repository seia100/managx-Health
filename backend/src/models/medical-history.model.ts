// src/models/medical-history.model.ts
import { Model } from './base.model';
import { BaseModel } from './types';

export interface MedicalHistory extends BaseModel {
    paciente_id: string;
    medico_id: string;
    descripcion: string;
    fecha: Date;
    diagnostico: string;
    tratamiento: string;
    archivos_adjuntos: Record<string, any>;
}

export class MedicalHistoryModel extends Model<MedicalHistory> {
    constructor() {
        super('historiales_medicos');
    }

    public async findByPatientId(patientId: string): Promise<MedicalHistory[]> {
        const query = `
            SELECT h.*, u.nombre as medico_nombre
            FROM ${this.tableName} h
            JOIN usuarios u ON h.medico_id = u.id
            WHERE h.paciente_id = $1
            ORDER BY h.fecha DESC
        `;

        const result = await this.executeQuery<MedicalHistory>(query, [patientId]);
        return result.rows;
    }

    public async addAttachment(
        id: string,
        fileData: Record<string, any>
    ): Promise<MedicalHistory | null> {
        const query = `
            UPDATE ${this.tableName}
            SET archivos_adjuntos = archivos_adjuntos || $2::jsonb
            WHERE id = $1
            RETURNING *
        `;

        const result = await this.executeQuery<MedicalHistory>(
            query,
            [id, JSON.stringify(fileData)]
        );
        return result.rows[0] || null;
    }
}