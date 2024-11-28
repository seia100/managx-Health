// patientController.ts
import { Request, Response } from 'express';
import pool from '../config/db';
import Logger from '../config/logger';

/**
 * Crear un nuevo paciente
 */
export const createPatient = async (req: Request, res: Response) => {
    const { nombre, fechaNacimiento, direccion, telefono, email } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO pacientes (nombre, fechaNacimiento, direccion, telefono, email) VALUES ($1, $2, $3, $4, $5) RETURNING id',
            [nombre, fechaNacimiento, direccion, telefono, email]
        );

        res.status(201).json({ patientId: result.rows[0].id, message: 'Paciente creado exitosamente' });
    } catch (err) {
        Logger.error('Error al crear paciente', err as Error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

/**
 * Obtener todos los pacientes
 */
export const getPatients = async (_req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM pacientes ORDER BY created_at DESC');
        res.status(200).json(result.rows);
    } catch (err) {
        Logger.error('Error al obtener pacientes', err as Error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

/**
 * Actualizar la información de un paciente
 */
export const updatePatient = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { nombre, fechaNacimiento, direccion, telefono, email } = req.body;

    try {
        const result = await pool.query(
            'UPDATE pacientes SET nombre = $1, fechaNacimiento = $2, direccion = $3, telefono = $4, email = $5 WHERE id = $6 RETURNING *',
            [nombre, fechaNacimiento, direccion, telefono, email, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Paciente no encontrado' });
        }

        res.status(200).json({ message: 'Paciente actualizado', patient: result.rows[0] });
    } catch (err) {
        Logger.error('Error al actualizar paciente', err as Error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

/**
 * Eliminar un paciente
 */
export const deletePatient = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const result = await pool.query('DELETE FROM pacientes WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Paciente no encontrado' });
        }

        res.status(200).json({ message: 'Paciente eliminado' });
    } catch (err) {
        Logger.error('Error al eliminar paciente', err as Error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};
