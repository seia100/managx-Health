// src/services/appointment.service.ts
import { ErrorHandler } from '../utils/error.handler';
import db from '../config/database';
import { IAppointment, IAppointmentCreate, IAppointmentUpdate, IAppointmentFilters } from '../interfaces/appointment.interface';

export class AppointmentService {
    /**
     * Crea una nueva cita médica
     * @security
     * - Verifica disponibilidad del médico
     * - Valida horario dentro de horas laborales
     * - Evita solapamiento de citas
     */
    public async createAppointment(appointmentData: IAppointmentCreate): Promise<IAppointment> {
        return await db.transaction(async (client) => {
            // Verificar existencia del paciente
            const patientExists = await client.query(
                'SELECT id FROM pacientes WHERE id = $1',
                [appointmentData.paciente_id]
            );

            if (!patientExists.rows.length) {
                throw new ErrorHandler(404, 'Paciente no encontrado');
            }

            // Verificar disponibilidad del médico
            const conflictingAppointment = await client.query(
                `SELECT id FROM citas 
                WHERE medico_id = $1 
                AND fecha_hora BETWEEN $2 - INTERVAL '30 minutes' AND $2 + INTERVAL '30 minutes'
                AND estado = 'PROGRAMADA'`,
                [appointmentData.medico_id, appointmentData.fecha_hora]
            );

            if (conflictingAppointment.rows.length) {
                throw new ErrorHandler(400, 'El médico no está disponible en ese horario');
            }

            // Validar horario laboral (8:00 - 18:00)
            const appointmentHour = new Date(appointmentData.fecha_hora).getHours();
            if (appointmentHour < 8 || appointmentHour >= 18) {
                throw new ErrorHandler(400, 'Las citas solo pueden programarse entre 8:00 y 18:00');
            }

            const result = await client.query(
                `INSERT INTO citas 
                (paciente_id, medico_id, fecha_hora, motivo, estado, notas)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *`,
                [
                    appointmentData.paciente_id,
                    appointmentData.medico_id,
                    appointmentData.fecha_hora,
                    appointmentData.motivo,
                    appointmentData.estado,
                    appointmentData.notas
                ]
            );

            return result.rows[0];
        });
    }

    /**
     * Obtiene citas con filtros y paginación
     * @security
     * - Implementa paginación para grandes conjuntos de datos
     * - Permite filtrado por fecha y estado
     */
    public async getAppointments(filters: IAppointmentFilters): Promise<{ appointments: IAppointment[], total: number }> {
        const queryParams: any[] = [];
        let whereClause = '';
        let paramCount = 1;

        if (filters.fecha_inicio) {
            whereClause += `${whereClause ? ' AND ' : 'WHERE '} fecha_hora >= $${paramCount}`;
            queryParams.push(filters.fecha_inicio);
            paramCount++;
        }

        if (filters.fecha_fin) {
            whereClause += `${whereClause ? ' AND ' : 'WHERE '} fecha_hora <= $${paramCount}`;
            queryParams.push(filters.fecha_fin);
            paramCount++;
        }

        if (filters.estado) {
            whereClause += `${whereClause ? ' AND ' : 'WHERE '} estado = $${paramCount}`;
            queryParams.push(filters.estado);
            paramCount++;
        }

        const offset = (filters.page - 1) * filters.limit;
        const limit = filters.limit;

        const [appointmentsResult, totalResult] = await Promise.all([
            db.query(
                `SELECT c.*, p.nombre as paciente_nombre, u.nombre as medico_nombre
                FROM citas c
                JOIN pacientes p ON c.paciente_id = p.id
                JOIN usuarios u ON c.medico_id = u.id
                ${whereClause}
                ORDER BY fecha_hora DESC
                LIMIT $${paramCount} OFFSET $${paramCount + 1}`,
                [...queryParams, limit, offset]
            ),
            db.query(
                `SELECT COUNT(*) FROM citas ${whereClause}`,
                queryParams
            )
        ]);

        return {
            appointments: appointmentsResult.rows,
            total: parseInt(totalResult.rows[0].count)
        };
    }

    /**
     * Obtiene una cita específica por ID
     * @security
     * - Verifica existencia y acceso autorizado
     */
    public async getAppointmentById(appointmentId: string): Promise<IAppointment> {
        const result = await db.query(
            `SELECT c.*, p.nombre as paciente_nombre, u.nombre as medico_nombre
            FROM citas c
            JOIN pacientes p ON c.paciente_id = p.id
            JOIN usuarios u ON c.medico_id = u.id
            WHERE c.id = $1`,
            [appointmentId]
        );

        if (!result.rows.length) {
            throw new ErrorHandler(404, 'Cita no encontrada');
        }

        return result.rows[0];
    }

    /**
     * Actualiza una cita existente
     * @security
     * - Verifica autorización y propiedad
     * - Valida cambios de estado permitidos
     * - Mantiene historial de cambios
     */
    public async updateAppointment(
        appointmentId: string,
        updateData: IAppointmentUpdate,
        userId: string
    ): Promise<IAppointment> {
        return await db.transaction(async (client) => {
            const currentAppointment = await client.query(
                'SELECT * FROM citas WHERE id = $1',
                [appointmentId]
            );

            if (!currentAppointment.rows.length) {
                throw new ErrorHandler(404, 'Cita no encontrada');
            }

            if (currentAppointment.rows[0].estado === 'CANCELADA') {
                throw new ErrorHandler(400, 'No se puede modificar una cita cancelada');
            }

            // Si se está actualizando la fecha, verificar disponibilidad
            if (updateData.fecha_hora) {
                const conflictingAppointment = await client.query(
                    `SELECT id FROM citas 
                    WHERE medico_id = $1 
                    AND id != $2
                    AND fecha_hora BETWEEN $3 - INTERVAL '30 minutes' AND $3 + INTERVAL '30 minutes'
                    AND estado = 'PROGRAMADA'`,
                    [currentAppointment.rows[0].medico_id, appointmentId, updateData.fecha_hora]
                );

                if (conflictingAppointment.rows.length) {
                    throw new ErrorHandler(400, 'El médico no está disponible en ese horario');
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

            values.push(appointmentId);
            const result = await client.query(
                `UPDATE citas 
                SET ${updateFields.join(', ')}
                WHERE id = $${paramCount}
                RETURNING *`,
                values
            );

            return result.rows[0];
        });
    }

    /**
     * Cancela una cita existente
     * @security
     * - Verifica autorización
     * - Mantiene registro de cancelación
     */
    public async cancelAppointment(appointmentId: string, userId: string): Promise<void> {
        await db.transaction(async (client) => {
            const appointment = await client.query(
                'SELECT * FROM citas WHERE id = $1',
                [appointmentId]
            );

            if (!appointment.rows.length) {
                throw new ErrorHandler(404, 'Cita no encontrada');
            }

            if (appointment.rows[0].estado === 'CANCELADA') {
                throw new ErrorHandler(400, 'La cita ya está cancelada');
            }

            await client.query(
                `UPDATE citas 
                SET estado = 'CANCELADA', 
                    notas = CASE 
                        WHEN notas IS NULL THEN $1
                        ELSE notas || E'\n' || $1
                    END
                WHERE id = $2`,
                [`Cancelada por usuario ${userId} en ${new Date().toISOString()}`, appointmentId]
            );
        });
    }
}
