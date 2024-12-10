// src/utils/logger.ts
import winston from 'winston';
import { APP_CONSTANTS } from '../config/constants';

/**
 * Sistema de logging centralizado que proporciona diferentes niveles
 * de registro y formateo consistente de mensajes.
 * 
 * Características:
 * - Múltiples niveles de log (error, warn, info, debug)
 * - Rotación de archivos de log
 * - Formato consistente con timestamps
 * - Diferentes destinos según el ambiente
 */
class Logger {
    private static instance: Logger;
    private logger: winston.Logger;

    private constructor() {
        const logFormat = winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
            winston.format.prettyPrint()
        );

        this.logger = winston.createLogger({
            level: process.env.LOG_LEVEL || 'info',
            format: logFormat,
            transports: [
                // Archivo para errores
                new winston.transports.File({
                    filename: 'logs/error.log',
                    level: 'error',
                    maxsize: 5242880, // 5MB
                    maxFiles: 5
                }),
                // Archivo para todos los logs
                new winston.transports.File({
                    filename: 'logs/combined.log',
                    maxsize: 5242880,
                    maxFiles: 5
                })
            ]
        });

        // En desarrollo, también log a consola
        if (process.env.NODE_ENV !== 'production') {
            this.logger.add(new winston.transports.Console({
                format: winston.format.combine(
                    winston.format.colorize(),
                    winston.format.simple()
                )
            }));
        }
    }

    public static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    public error(message: string, meta?: any): void {
        this.logger.error(message, meta);
    }

    public warn(message: string, meta?: any): void {
        this.logger.warn(message, meta);
    }

    public info(message: string, meta?: any): void {
        this.logger.info(message, meta);
    }

    public debug(message: string, meta?: any): void {
        this.logger.debug(message, meta);
    }

    public stream = {
        write: (message: string): void => {
            this.info(message);
        }
    };
}

export const logger = Logger.getInstance();