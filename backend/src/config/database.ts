// src/config/database.ts
import { Pool, PoolConfig } from 'pg';
import { DatabaseConfig } from './types';
import { logger } from '@/utils/logger';

/**
 * Configuración de la conexión a PostgreSQL utilizando un pool de conexiones
 * para mejorar el rendimiento y la escalabilidad.
 * 
 * @remarks
 * Utilizamos un pool de conexiones por las siguientes razones:
 * 1. Reutilización de conexiones
 * 2. Límite de conexiones concurrentes
 * 3. Gestión automática de conexiones caídas
 */
class Database {
    private static instance: Database;
    private pool: Pool;

    private constructor() {
        const config: DatabaseConfig = {
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '5432'),
            database: process.env.DB_NAME || 'healthcare_db',
            user: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD || '',
            max: parseInt(process.env.DB_POOL_MAX || '20'),
            idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '30000')
        };

        this.pool = new Pool(config);

        // Manejo de eventos del pool
        this.pool.on('connect', () => {
            logger.info('Nueva conexión establecida con PostgreSQL');
        });

        this.pool.on('error', (err) => {
            logger.error('Error en el pool de PostgreSQL:', err);
        });
    }

    public static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }

    public getPool(): Pool {
        return this.pool;
    }

    public async healthCheck(): Promise<boolean> {
        try {
            const client = await this.pool.connect();
            await client.query('SELECT 1');
            client.release();
            return true;
        } catch (error) {
            logger.error('Error en el health check de la base de datos:', error);
            return false;
        }
    }
}

export const db = Database.getInstance();