// tests/setup.ts
import { db } from '../src/config/database';
import { redis } from '../src/config/redis';

// Configuración global para pruebas
beforeAll(async () => {
    // Inicializar conexiones
    await db.getPool().connect();
    await redis.getClient().connect();
});

afterAll(async () => {
    // Cerrar conexiones
    await db.getPool().end();
    await redis.getClient().quit();
});