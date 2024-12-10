// src/services/medical-history.service.ts
import { MedicalHistoryModel, MedicalHistory } from '../models/medical-history.model';
import { NotFoundError, ValidationError } from '../utils/errors';
import { logger } from '../utils/logger';

export class MedicalHistoryService {
    private medicalHistoryModel: MedicalHistoryModel;

    constructor() {
        this.medicalHistoryModel = new MedicalHistoryModel();
    }

    /**
     * Crea un nuevo registro en el historial médico
     * Valida permisos y datos
     */
    public async create(data: Partial<MedicalHistory>): Promise<MedicalHistory> {
        try {
            const newHistory = await this.medicalHistoryModel.create(data);
            logger.info(`Historial médico creado: ${newHistory.id}`);
            return newHistory;
        } catch (error) {
            logger.error('Error creando historial médico:', error);
            throw error;
        }
    }

    /**
     * Obtiene el historial médico de un paciente
     */
    public async findByPatientId(patientId: string): Promise<MedicalHistory[]> {
        try {
            const histories = await this.medicalHistoryModel.findByPatientId(patientId);
            return histories;
        } catch (error) {
            logger.error(`Error obteniendo historiales del paciente ${patientId}:`, error);
            throw error;
        }
    }
}
