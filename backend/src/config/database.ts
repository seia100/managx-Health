// src/config/database.ts
/*
Configuración de base de datos:
    * Patrón Singleton para conexión única
    * Pool de conexiones para optimizar recursos
    * Manejo de transacciones y consultas

*/
import { Pool, PoolConfig } from 'pg';
import dotenv from 'dotenv';

/**
 * @theoreticalBackground
 * Patrón Singleton para conexión a base de datos:
 * - Garantiza una única instancia de conexión
 * - Reutilización eficiente de recursos
 * - Gestión centralizada de la conexión
 */
export class DatabaseConnection {
    private static instance: DatabaseConnection;
    private pool: Pool;

    private constructor() {
        dotenv.config();

        const config: PoolConfig = {
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD,
            port: parseInt(process.env.DB_PORT || '5432'),
            ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
            // Configuración de Pool para optimizar recursos
            max: 20, // máximo de conexiones concurrentes
            idleTimeoutMillis: 30000, // tiempo máximo de inactividad
            connectionTimeoutMillis: 2000 // tiempo máximo para establecer conexión
        };

        this.pool = new Pool(config);

        // Manejo de errores a nivel de pool
        this.pool.on('error', (err) => {
            console.error('Error inesperado del pool de conexiones:', err);
        });
    }

    public static getInstance(): DatabaseConnection {
        if (!DatabaseConnection.instance) {
            DatabaseConnection.instance = new DatabaseConnection();
        }
        return DatabaseConnection.instance;
    }

    /**
     * Ejecuta una consulta en la base de datos
     * @param query - Consulta SQL
     * @param params - Parámetros para la consulta
     * @returns Promise con el resultado de la consulta
     */
    public async query(query: string, params?: any[]): Promise<any> {
        const client = await this.pool.connect();
        try {
            return await client.query(query, params);
        } finally {
            client.release();
        }
    }

    /**
     * Ejecuta una transacción en la base de datos
     * @param callback - Función que ejecuta las operaciones de la transacción
     */
    public async transaction<T>(callback: (client: any) => Promise<T>): Promise<T> {
        const client = await this.pool.connect();
        try {
            await client.query('BEGIN');
            const result = await callback(client);
            await client.query('COMMIT');
            return result;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }
}

export default DatabaseConnection.getInstance();