// src/services/patient.service.ts
import { PatientModel, Patient } from '@/models/patient.model';
import { ValidationError, NotFoundError, DatabaseError } from '@/utils/errors';
import { logger } from '@/utils/logger';
import { redis } from '@/config/redis';

export class PatientService {
    private patientModel: PatientModel;
    private readonly CACHE_PREFIX = 'patients:list:';
    private readonly CACHE_TTL = 3600; // 1 hora en segundos

    constructor() {
        this.patientModel = new PatientModel();
    }

    /**
     * Crea un nuevo paciente con validaciones
     * @throws ValidationError si el email ya existe
     * @throws DatabaseError si hay error en la operación
     */
    public async create(patientData: Partial<Patient>): Promise<Patient> {
        try {
            if (patientData.email) {
                const existingPatient = await this.patientModel.findByEmail(patientData.email);
                if (existingPatient) {
                    throw new ValidationError('El email ya está registrado');
                }
            }

            const newPatient = await this.patientModel.create(patientData);
            
            // Invalidar todos los cachés de listados
            await this.invalidateListCache();
            
            logger.info(`Paciente creado: ${newPatient.id}`);
            return newPatient;
        } catch (error) {
            logger.error('Error creando paciente:', error);
            throw error instanceof ValidationError ? error : 
                    new DatabaseError(`Error en operación de base de datos: ${error}`);
        }
    }

    /**
     * Obtiene un listado paginado de pacientes con caché
     * @param page Número de página (comienza en 1)
     * @param limit Cantidad de registros por página
     * @returns Objeto con datos paginados y total de registros
     */
    public async findAll(
        page: number,
        limit: number
    ): Promise<{ data: Patient[]; total: number }> {
        try {
            const cacheKey = `${this.CACHE_PREFIX}${page}:${limit}`;
            
            // Intentar obtener del caché
            const cachedData = await redis.getClient().get(cacheKey);
            if (cachedData) {
                return JSON.parse(cachedData);
            }

            // Si no está en caché, obtener de la base de datos
            const offset = (page - 1) * limit;
            const result = await this.patientModel.findAll(limit, offset);
            const total = await this.patientModel.count();

            const response = {
                data: result,
                total: total
            };

            // Guardar en caché
            await redis.getClient().setex(
                cacheKey,
                this.CACHE_TTL,
                JSON.stringify(response)
            );

            return response;
        } catch (error) {
            logger.error('Error obteniendo pacientes:', error);
            throw new DatabaseError(
                `Error en operación de base de datos: ${error}`
            );
        }
    }

    /**
     * Invalida todas las claves de caché relacionadas con listados
     * @private
     */
    private async invalidateListCache(): Promise<void> {
        const client = redis.getClient();
        const keys = await client.keys(`${this.CACHE_PREFIX}*`);
        if (keys.length > 0) {
            await client.del(...keys);
        }
    }
}