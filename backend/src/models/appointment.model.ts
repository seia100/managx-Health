// src/models/appointment.model.ts
import { BaseModel } from './types';
import { Model } from '@/models/base.model';
import { AppointmentStatus } from '@/types';

export interface Appointment extends BaseModel {
    paciente_id: string;
    medico_id: string;
    fecha_hora: Date;
    motivo: string;
    estado: AppointmentStatus;
    notas: string | null;
}

export class AppointmentModel extends Model<Appointment> {
    constructor() {
        super('citas');
    }

    public async findByPatientId(patientId: string): Promise<Appointment[]> {
        const query = `
            SELECT c.*, u.nombre as medico_nombre
            FROM ${this.tableName} c
            JOIN usuarios u ON c.medico_id = u.id
            WHERE c.paciente_id = $1
            ORDER BY c.fecha_hora DESC
        `;

        const result = await this.executeQuery<Appointment>(query, [patientId]);
        return result.rows;
    }

    public async findByDoctorId(
        doctorId: string,
        date?: string
    ): Promise<Appointment[]> {
        let query = `
            SELECT c.*, p.nombre as paciente_nombre
            FROM ${this.tableName} c
            JOIN pacientes p ON c.paciente_id = p.id
            WHERE c.medico_id = $1
        `;

        const params = [doctorId];

        if (date) {
            query += ` AND DATE(c.fecha_hora) = $2`;
            params.push(date);
        }

        query += ` ORDER BY c.fecha_hora ASC`;

        const result = await this.executeQuery<Appointment>(query, params);
        return result.rows;
    }

    public async updateStatus(
        id: string,
        status: AppointmentStatus
    ): Promise<Appointment | null> {
        const query = `
            UPDATE ${this.tableName}
            SET estado = $2, updated_at = CURRENT_TIMESTAMP
            WHERE id = $1
            RETURNING *
        `;

        const result = await this.executeQuery<Appointment>(query, [id, status]);
        return result.rows[0] || null;
    }

    public async checkAvailability(
        doctorId: string,
        dateTime: Date
    ): Promise<boolean> {
        const query = `
            SELECT COUNT(*) as count
            FROM ${this.tableName}
            WHERE medico_id = $1
            AND fecha_hora = $2
            AND estado != 'CANCELADA'
        `;

        const result = await this.executeQuery<{ count: string }>(
            query,
            [doctorId, dateTime]
        );
        return parseInt(result.rows[0].count) === 0;
    }
}