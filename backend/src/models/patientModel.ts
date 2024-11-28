// Importa la configuración de la base de datos para ejecutar consultas PostgreSQL.
import pool from '../config/db';

/**
 * Modelo para interactuar con la tabla `usuarios` en la base de datos.
 * Contiene métodos para realizar operaciones específicas relacionadas con los usuarios.
 */

/**
 * Crea un nuevo usuario en la base de datos.
 * @param nombre - Nombre del usuario.
 * @param email - Dirección de correo electrónico del usuario.
 * @param contraseña - Contraseña del usuario (normalmente encriptada).
 * @param rol - Rol del usuario (ej. "admin", "user").
 * @returns El registro completo del usuario recién creado.
 */
export const createUser = async (nombre: string, email: string, contraseña: string, rol: string) => {
    // Inserta un nuevo registro en la tabla `usuarios` con los valores proporcionados.
    // Utiliza parámetros preparados ($1, $2, etc.) para prevenir inyección SQL.
    const result = await pool.query(
        'INSERT INTO usuarios (nombre, email, contraseña, rol) VALUES ($1, $2, $3, $4) RETURNING *',
        [nombre, email, contraseña, rol]
    );

    // Retorna el primer (y único) registro de la consulta, que contiene el usuario creado.
    return result.rows[0];
};

/**
 * Busca un usuario por su correo electrónico.
 * @param email - Dirección de correo electrónico del usuario.
 * @returns El registro completo del usuario si se encuentra, de lo contrario `undefined`.
 */
export const findUserByEmail = async (email: string) => {
    // Realiza una consulta en la tabla `usuarios` para buscar por email.
    // Utiliza parámetros preparados para evitar inyección SQL.
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);

    // Retorna el primer (y único) registro de la consulta si existe, o `undefined` si no se encuentra.
    return result.rows[0];
};
