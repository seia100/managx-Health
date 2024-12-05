// src/services/patient.service.ts

import db from '../config/database';
import { ErrorHandler } from '../utils/error.handler';

/**
 * @theoreticalBackground
 * Servicio para gestión de pacientes:
 * - Implementa operaciones CRUD
 * - Maneja lógica de negocio relacionada con pacientes
 * - Centraliza validaciones de dominio
 */
export class PatientService {
    /**
     * Crea un nuevo paciente
     * @security Validación de datos y unicidad de email
     */
    public async createPatient(patientData: any): Promise<any> {
        return await db.transaction(async (client) => {
            if (patientData.email) {
                const existingPatient = await client.query(
                    'SELECT id FROM pacientes WHERE email = $1',
                    [patientData.email]
                );

                if (existingPatient.rows.length) {
                    throw new ErrorHandler(400, 'El email ya está registrado');
                }
            }

            const result = await client.query(
                `INSERT INTO pacientes (
                    nombre, fecha_nacimiento, direccion, telefono, 
                    email, tipo_sangre, alergias
                ) VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING *`,
                [
                    patientData.nombre,
                    patientData.fecha_nacimiento,
                    patientData.direccion,
                    patientData.telefono,
                    patientData.email,
                    patientData.tipo_sangre,
                    patientData.alergias
                ]
            );

            return result.rows[0];
        });
    }

    /**
     * Obtiene lista paginada de pacientes
     * @param options Opciones de paginación y búsqueda
     */
    public async getPatients({ page, limit, search }: { 
        page: number; 
        limit: number; 
        search?: string; 
    }): Promise<any> {
        const offset = (page - 1) * limit;
        let query = 'SELECT * FROM pacientes';
        const params: any[] = [];

        if (search) {
            query += ' WHERE nombre ILIKE $1 OR email ILIKE $1';
            params.push(`%${search}%`);
        }

        query += ` ORDER BY nombre LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        params.push(limit, offset);

        const result = await db.query(query, params);
        const total = await db.query('SELECT COUNT(*) FROM pacientes');

        return {
            patients: result.rows,
            total: parseInt(total.rows[0].count),
            page,
            totalPages: Math.ceil(parseInt(total.rows[0].count) / limit)
        };
    }

    /**
     * Obtiene un paciente por su ID
     */
    public async getPatientById(id: string): Promise<any> {
        const result = await db.query(
            'SELECT * FROM pacientes WHERE id = $1',
            [id]
        );

        if (!result.rows.length) {
            throw new ErrorHandler(404, 'Paciente no encontrado');
        }

        return result.rows[0];
    }

    /**
     * Actualiza datos de un paciente
     * @security Validación de datos y unicidad de email
     */
    public async updatePatient(id: string, updateData: any): Promise<any> {
        return await db.transaction(async (client) => {
            if (updateData.email) {
                const existingPatient = await client.query(
                    'SELECT id FROM pacientes WHERE email = $1 AND id != $2',
                    [updateData.email, id]
                );

                if (existingPatient.rows.length) {
                    throw new ErrorHandler(400, 'El email ya está en uso');
                }
            }

            const updateFields: string[] = [];
            const values: any[] = [];
            let paramCount = 1;

            Object.entries(updateData).forEach(([key, value]) => {
                if (value !== undefined) {
                    updateFields.push(`${key} = $${paramCount}`);
                    values.push(value);
                    paramCount++;
                }
            });

            values.push(id);
            const result = await client.query(
                    `UPDATE pacientes 
                    SET ${updateFields.join(', ')}
                    WHERE id = $${paramCount}
                    RETURNING *`,
                values
            );

            if (!result.rows.length) {
                throw new ErrorHandler(404, 'Paciente no encontrado');
            }

            return result.rows[0];
        });
    }

    /**
     * Elimina un paciente
     * @security Verificación de dependencias antes de eliminar
     */
    public async deletePatient(id: string): Promise<void> {
        return await db.transaction(async (client) => {
            // Verificar si tiene historiales médicos
            const historiales = await client.query(
                'SELECT id FROM historiales_medicos WHERE paciente_id = $1 LIMIT 1',
                [id]
            );

            if (historiales.rows.length) {
                throw new ErrorHandler(400, 'No se puede eliminar el paciente porque tiene historiales médicos asociados');
            }

            // Verificar si tiene citas pendientes
            const citas = await client.query(
                'SELECT id FROM citas WHERE paciente_id = $1 AND estado = $2 LIMIT 1',
                [id, 'PROGRAMADA']
            );

            if (citas.rows.length) {
                throw new ErrorHandler(400, 'No se puede eliminar el paciente porque tiene citas pendientes');
            }

            const result = await client.query(
                'DELETE FROM pacientes WHERE id = $1 RETURNING id',
                [id]
            );

            if (!result.rows.length) {
                throw new ErrorHandler(404, 'Paciente no encontrado');
            }
        });
    }
}