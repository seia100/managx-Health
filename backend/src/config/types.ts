// src/config/types.ts
// Definimos interfaces para tipar nuestras configuraciones
export interface DatabaseConfig {
    host: string;
    port: number;
    database: string;
    user: string;
    password: string;
    max: number; // máximo de conexiones en el pool
    idleTimeoutMillis: number; // tiempo máximo que una conexión puede estar inactiva
}

export interface RedisConfig {
host: string;
port: number;
password: string;
ttl: number; // tiempo de vida del cache en segundos
}

export interface JwtConfig {
secret: string;
expiresIn: string;
}

export interface AppConfig {
port: number;
env: string;
apiPrefix: string;
}
  
  