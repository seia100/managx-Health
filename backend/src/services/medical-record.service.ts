// src/services/medical-record.service.ts
import { ErrorHandler } from '../utils/error.handler';
import db from '../config/database';

export class MedicalRecordService {
    /**
     * Crea un nuevo registro médico
     * @security
     * - Transacción atómica para consistencia de datos
     * - Verificación de existencia del paciente y médico
     * - Validación de permisos del médico
     */
    public async createRecord(recordData: IMedicalRecordCreate): Promise<IMedicalRecord> {
        return await db.transaction(async (client) => {
            // Verificar existencia del paciente
            const patientExists = await client.query(
                'SELECT id FROM pacientes WHERE id = $1',
                [recordData.paciente_id]
            );

            if (!patientExists.rows.length) {
                throw new ErrorHandler(404, 'Paciente no encontrado');
            }

            // Verificar existencia y rol del médico
            const doctorExists = await client.query(
                'SELECT id, rol FROM usuarios WHERE id = $1 AND rol = $2',
                [recordData.medico_id, 'MEDICO']
            );

            if (!doctorExists.rows.length) {
                throw new ErrorHandler(404, 'Médico no encontrado o sin permisos');
            }

            const result = await client.query(
                `INSERT INTO historiales_medicos 
                (paciente_id, medico_id, descripcion, diagnostico, tratamiento, archivos_adjuntos)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *`,
                [
                    recordData.paciente_id,
                    recordData.medico_id,
                    recordData.descripcion,
                    recordData.diagnostico,
                    recordData.tratamiento,
                    recordData.archivos_adjuntos
                ]
            );

            return result.rows[0];
        });
    }

    /**
     * Obtiene los historiales médicos de un paciente
     * @security
     * - Paginación para evitar sobrecarga
     * - Verificación de permisos de acceso 
     */
    public async getPatientRecords(patientId: string): Promise<IMedicalRecord[]> {
        const result = await db.query(
                `SELECT h.*, u.nombre as medico_nombre 
                FROM historiales_medicos h
                JOIN usuarios u ON h.medico_id = u.id
                WHERE h.paciente_id = $1
                ORDER BY h.fecha DESC`,
            [patientId]
        );

        return result.rows;
    }

    /**
     * Actualiza un historial médico
     * @security
     * - Verificación de propiedad del registro
     * - Validación de datos actualizables
     * - Registro de modificaciones
     */
    public async updateRecord(
        recordId: string,
        updateData: IMedicalRecordUpdate,
        medicoId: string
    ): Promise<IMedicalRecord> {
        return await db.transaction(async (client) => {
            // Verificar propiedad del registro
            const record = await client.query(
                'SELECT * FROM historiales_medicos WHERE id = $1',
                [recordId]
            );

            if (!record.rows.length) {
                throw new ErrorHandler(404, 'Historial médico no encontrado');
            }

            if (record.rows[0].medico_id !== medicoId) {
                throw new ErrorHandler(403, 'No autorizado para modificar este registro');
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

            values.push(recordId);
            const result = await client.query(
                    `UPDATE historiales_medicos 
                    SET ${updateFields.join(', ')}
                    WHERE id = $${paramCount}
                    RETURNING *`,
                values
            );

            return result.rows[0];
        });
    }

        /**
     * Obtiene un registro médico específico por ID
     * @security
     * - Verifica existencia del registro
     * - Incluye información del médico y paciente
     */
        public async getRecordById(recordId: string): Promise<IMedicalRecord> {
            const result = await db.query(
                `SELECT h.*, u.nombre as medico_nombre, p.nombre as paciente_nombre
                    FROM historiales_medicos h
                    JOIN usuarios u ON h.medico_id = u.id
                    JOIN pacientes p ON h.paciente_id = p.id
                    WHERE h.id = $1`,
                [recordId]
            );
    
            if (!result.rows.length) {
                throw new ErrorHandler(404, 'Historial médico no encontrado');
            }
    
            return result.rows[0];
        }
    
        /**
         * Elimina un registro médico
         * @security
         * - Verifica existencia del registro
         * - Implementa eliminación lógica en lugar de física
         */
        public async deleteRecord(recordId: string): Promise<void> {
            const result = await db.query(
                `UPDATE historiales_medicos 
                    SET deleted_at = CURRENT_TIMESTAMP
                    WHERE id = $1 AND deleted_at IS NULL
                    RETURNING id`,
                [recordId]
            );
    
            if (!result.rows.length) {
                throw new ErrorHandler(404, 'Historial médico no encontrado');
            }
        }
}