// authController.ts
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';
import pool from '../config/db';
import Logger from '../config/logger';

export const register = async (req: Request, res: Response) => {
    try {
        const { nombre, email, contraseña, rol } = req.body;

        // Validar entrada (esto puede integrarse con Joi)
        if (!nombre || !email || !contraseña || !rol) {
            return res.status(400).json({ message: 'Faltan datos requeridos' });
        }

        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(contraseña, 10);

        // Insertar el usuario en la base de datos
        const result = await pool.query(
            'INSERT INTO usuarios (nombre, email, contraseña, rol) VALUES ($1, $2, $3, $4) RETURNING id',
            [nombre, email, hashedPassword, rol]
        );

        res.status(201).json({ userId: result.rows[0].id, message: 'Usuario registrado exitosamente' });
    } catch (err) {
        Logger.error('Error en el registro de usuario', err as Error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, contraseña } = req.body;

        // Buscar el usuario por email
        const userResult = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const user = userResult.rows[0];

        // Validar contraseña
        const validPassword = await bcrypt.compare(contraseña, user.contraseña);
        if (!validPassword) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        // Generar un token JWT
        const token = jwt.sign({ userId: user.id, rol: user.rol }, ENV.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token });
    } catch (err) {
        Logger.error('Error en el inicio de sesión', err as Error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

