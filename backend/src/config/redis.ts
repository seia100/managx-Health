// src/config/redis.ts
import Redis from 'ioredis';
import { RedisConfig } from './types';
import { logger } from '@/utils/logger';

/**
 * Configuración del cliente Redis para caché
 * Implementamos un patrón Singleton para asegurar una única instancia
 * de conexión a Redis en toda la aplicación.
 */
class RedisClient {
    private static instance: RedisClient;
    private client: Redis;

    private constructor() {
        const config: RedisConfig = {
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT || '6379'),
            password: process.env.REDIS_PASSWORD || '',
            ttl: parseInt(process.env.REDIS_TTL || '3600')
        };

        this.client = new Redis({
            host: config.host,
            port: config.port,
            password: config.password,
            retryStrategy: (times: number) => {
                const delay = Math.min(times * 50, 2000);
                return delay;
            }
        });

        this.client.on('connect', () => {
            logger.info('Conexión establecida con Redis');
        });

        this.client.on('error', (error) => {
            logger.error('Error en la conexión con Redis:', error);
        });
    }

    public static getInstance(): RedisClient {
        if (!RedisClient.instance) {
            RedisClient.instance = new RedisClient();
        }
        return RedisClient.instance;
    }

    public getClient(): Redis {
        return this.client;
    }

    public async healthCheck(): Promise<boolean> {
        try {
            await this.client.ping();
            return true;
        } catch (error) {
            logger.error('Error en el health check de Redis:', error);
            return false;
        }
    }
}

export const redis = RedisClient.getInstance();