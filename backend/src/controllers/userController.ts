// userController.ts
import { Request, Response } from 'express';
import pool from '../config/db';

export const getUserProfile = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const user = await pool.query('SELECT id, nombre, email, rol, fechaRegistro FROM usuarios WHERE id = $1', [id]);

        if (user.rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.status(200).json(user.rows[0]);
    } catch (err) {
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};
