// Importa la configuración de la base de datos para ejecutar consultas PostgreSQL.
import pool from '../config/db';

/**
 * Modelo para interactuar con la tabla `pacientes` en la base de datos.
 * Contiene métodos para realizar operaciones relacionadas con los pacientes.
 */

/**
 * Crea un nuevo paciente en la base de datos.
 * @param nombre - Nombre completo del paciente.
 * @param fechaNacimiento - Fecha de nacimiento del paciente.
 * @param direccion - Dirección de residencia del paciente.
 * @param telefono - Número de teléfono del paciente.
 * @param email - Correo electrónico del paciente.
 * @returns El registro completo del paciente recién creado.
 */
export const createPatient = async (
    nombre: string,
    fechaNacimiento: Date,
    direccion: string,
    telefono: string,
    email: string
) => {
    // Inserta un nuevo registro en la tabla `pacientes` con los datos proporcionados.
    // Utiliza parámetros preparados ($1, $2, etc.) para prevenir inyección SQL.
    const result = await pool.query(
        'INSERT INTO pacientes (nombre, fechaNacimiento, direccion, telefono, email) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [nombre, fechaNacimiento, direccion, telefono, email]
    );

    // Retorna el primer (y único) registro de la consulta, que contiene el paciente creado.
    return result.rows[0];
};

/**
 * Obtiene todos los pacientes almacenados en la base de datos.
 * @returns Una lista de todos los registros en la tabla `pacientes`, ordenados por la fecha de creación (descendente).
 */
export const getAllPatients = async () => {
    // Realiza una consulta para obtener todos los registros de la tabla `pacientes`.
    // Los resultados se ordenan por el campo `created_at` en orden descendente.
    const result = await pool.query('SELECT * FROM pacientes ORDER BY created_at DESC');

    // Retorna un arreglo de registros de pacientes.
    return result.rows;
};
