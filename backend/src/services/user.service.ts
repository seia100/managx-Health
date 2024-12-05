// src/services/user.service.ts

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { IUserCreate, IUserLogin, IUser, IUserUpdate } from '../interfaces/user.interface';
import { ErrorHandler } from '../utils/error.handler';
import db from '../config/database';

/**
 * @theoreticalBackground
 * Servicio que implementa la lógica de negocio para usuarios:
 * - Separación de responsabilidades (SRP del SOLID)
 * - Manejo de transacciones atómicas
 * - Centralización de lógica de negocio
 */
export class UserService {
    private static readonly SALT_ROUNDS = 10;

    /**
     * Crea un nuevo usuario en el sistema
     * @security
     * - Hash de contraseña con bcrypt
     * - Validación de email único
     * - Transacción atómica
     */
    public async createUser(userData: IUserCreate): Promise<Omit<IUser, 'password_hash'>> {
        return await db.transaction(async (client) => {
            // Verificar si el email ya existe
            const existingUser = await client.query(
                'SELECT id FROM usuarios WHERE email = $1',
                [userData.email]
            );

            if (existingUser.rows.length) {
                throw new ErrorHandler(400, 'El email ya está registrado');
            }

            // Hash de la contraseña
            const password_hash = await bcrypt.hash(userData.password, UserService.SALT_ROUNDS);

            // Crear usuario
            const result = await client.query(
                    `INSERT INTO usuarios (nombre, email, password_hash, rol)
                    VALUES ($1, $2, $3, $4)
                    RETURNING id, nombre, email, rol, fecha_registro, activo`,
                [userData.nombre, userData.email, password_hash, userData.rol]
            );

            return result.rows[0];
        });
    }

    /**
     * Autentica un usuario y genera un token JWT
     * @security
     * - Verificación de contraseña con bcrypt
     * - Generación de JWT con expiración
     * - Actualización de último acceso
     */
    public async loginUser(loginData: IUserLogin): Promise<{ token: string; user: Omit<IUser, 'password_hash'> }> {
        const result = await db.query(
            'SELECT * FROM usuarios WHERE email = $1 AND activo = true',
            [loginData.email]
        );

        const user = result.rows[0];

        if (!user) {
            throw new ErrorHandler(401, 'Credenciales inválidas');
        }

        const isPasswordValid = await bcrypt.compare(loginData.password, user.password_hash);

        if (!isPasswordValid) {
            // Incrementar contador de intentos fallidos
            await db.query(
                'UPDATE usuarios SET intentos_fallidos = intentos_fallidos + 1 WHERE id = $1',
                [user.id]
            );

            throw new ErrorHandler(401, 'Credenciales inválidas');
        }

        // Resetear intentos fallidos y actualizar último acceso
        await db.query(
            'UPDATE usuarios SET intentos_fallidos = 0, ultimo_acceso = CURRENT_TIMESTAMP WHERE id = $1',
            [user.id]
        );

        const token = jwt.sign(
            { 
                id: user.id, 
                email: user.email, 
                rol: user.rol 
            },
            process.env.JWT_SECRET!,
            { expiresIn: '24h' }
        );

        const { password_hash, ...userWithoutPassword } = user;
        return { token, user: userWithoutPassword };
    }

    /**
     * Obtiene un usuario por su ID
     * @security Verificación de existencia
     */
    public async getUserById(id: string): Promise<Omit<IUser, 'password_hash'>> {
        const result = await db.query(
            'SELECT id, nombre, email, rol, fecha_registro, ultimo_acceso, activo FROM usuarios WHERE id = $1',
            [id]
        );

        if (!result.rows.length) {
            throw new ErrorHandler(404, 'Usuario no encontrado');
        }

        return result.rows[0];
    }

    /**
     * Actualiza los datos de un usuario
     * @security
     * - Validación de datos actualizables
     * - Hash de nueva contraseña si se proporciona
     */
    public async updateUser(id: string, updateData: IUserUpdate): Promise<Omit<IUser, 'password_hash'>> {
        return await db.transaction(async (client) => {
            const currentUser = await this.getUserById(id);

            if (updateData.email && updateData.email !== currentUser.email) {
                const existingEmail = await client.query(
                    'SELECT id FROM usuarios WHERE email = $1 AND id != $2',
                    [updateData.email, id]
                );

                if (existingEmail.rows.length) {
                    throw new ErrorHandler(400, 'El email ya está en uso');
                }
            }

            const updateFields: string[] = [];
            const values: any[] = [];
            let paramCount = 1;

            Object.entries(updateData).forEach(([key, value]) => {
                if (value !== undefined && key !== 'password') {
                    updateFields.push(`${key} = $${paramCount}`);
                    values.push(value);
                    paramCount++;
                }
            });

            if (updateData.password) {
                updateFields.push(`password_hash = $${paramCount}`);
                values.push(await bcrypt.hash(updateData.password, UserService.SALT_ROUNDS));
                paramCount++;
            }

            values.push(id);
            const result = await client.query(
                    `UPDATE usuarios 
                    SET ${updateFields.join(', ')}
                    WHERE id = $${paramCount}
                    RETURNING id, nombre, email, rol, fecha_registro, ultimo_acceso, activo`,
                values
            );

            return result.rows[0];
        });
    }

    /**
     * Elimina un usuario del sistema
     * @security Desactivación lógica en lugar de eliminación física
     */
    public async deleteUser(id: string): Promise<void> {
        const result = await db.query(
            'UPDATE usuarios SET activo = false WHERE id = $1 RETURNING id',
            [id]
        );

        if (!result.rows.length) {
            throw new ErrorHandler(404, 'Usuario no encontrado');
        }
    }
}