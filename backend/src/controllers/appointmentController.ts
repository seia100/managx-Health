// historyController.ts
import { Request, Response } from 'express';
import pool from '../config/db';
import Logger from '../config/logger';

/**
 * Crear un historial médico
 */
export const createHistory = async (req: Request, res: Response) => {
    const { pacienteId, descripcion, medicoId } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO historiales_medicos (pacienteId, descripcion, medicoId) VALUES ($1, $2, $3) RETURNING id',
            [pacienteId, descripcion, medicoId]
        );

        res.status(201).json({ historyId: result.rows[0].id, message: 'Historial médico creado exitosamente' });
    } catch (err) {
        Logger.error('Error al crear historial médico', err as Error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

/**
 * Obtener historiales médicos de un paciente
 */
export const getHistoriesByPatient = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const result = await pool.query('SELECT * FROM historiales_medicos WHERE pacienteId = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No se encontraron historiales médicos para este paciente' });
        }

        res.status(200).json(result.rows);
    } catch (err) {
        Logger.error('Error al obtener historiales médicos', err as Error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

/**
 * Actualizar un historial médico
 */
export const updateHistory = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { descripcion } = req.body;

    try {
        const result = await pool.query(
            'UPDATE historiales_medicos SET descripcion = $1 WHERE id = $2 RETURNING *',
            [descripcion, id]
        );

        if (result.rows.length === 0) {
            res.status(404).json({ message: 'Historial médico no encontrado' });
        }

        res.status(200).json({ message: 'Historial médico actualizado', history: result.rows[0] });
    } catch (err) {
        Logger.error('Error al actualizar historial médico', err as Error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

/**
 * Eliminar un historial médico
 */
export const deleteHistory = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const result = await pool.query('DELETE FROM historiales_medicos WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Historial médico no encontrado' });
        }

        res.status(200).json({ message: 'Historial médico eliminado' });
    } catch (err) {
        Logger.error('Error al eliminar historial médico', err as Error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};
