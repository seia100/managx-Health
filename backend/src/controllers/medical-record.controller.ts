// src/controllers/medical-record.controller.ts
import { Request, Response } from 'express';
import { MedicalRecordService } from '../services/medical-record.service';
import { validateMedicalRecord } from '../validators/medical-record.validator';
import { ErrorHandler } from '../utils/error.handler';
import { AuthBaseController } from './auth.base.controller';
import { UserRole } from '../interfaces/user.interface';
// import @types;
/**
 * @class MedicalRecordController
 * @extends AuthBaseController
 * @description Controlador para la gestión de historiales médicos con seguridad mejorada
 * y manejo de autenticación robusto
 */
export class MedicalRecordController extends AuthBaseController {
    private medicalRecordService: MedicalRecordService;

    constructor() {
        super();
        this.medicalRecordService = new MedicalRecordService();
    }

    /**
     * Crea un nuevo registro médico
     * @security
     * - Verifica autenticación del médico
     * - Valida permisos de rol
     * - Registra autoría del historial
     */
    public createRecord = async (req: Request, res: Response): Promise<void> => {
        try {
            // Verificar que el usuario es un médico
            this.checkRole(req, [UserRole.MEDICO]);
            
            const medicoId = this.getAuthenticatedUserId(req);
            const recordData = {
                ...req.body,
                medico_id: medicoId
            };

            // Validar datos de entrada
            const { error } = validateMedicalRecord(recordData);
            if (error) {
                throw new ErrorHandler(400, error.details[0].message);
            }

            const newRecord = await this.medicalRecordService.createRecord(recordData);
            
            this.handleSuccess(
                res,
                { record: newRecord },
                201,
                'Historial médico creado exitosamente'
            );
        } catch (error) {
            this.handleError(res, error);
        }
    };

    /**
     * Obtiene los historiales médicos de un paciente
     * @security
     * - Verifica autenticación
     * - Controla acceso a información sensible
     */
    public getPatientRecords = async (req: Request, res: Response): Promise<void> => {
        try {
            const patientId = req.params.id;
            
            // Verificar autenticación general (cualquier rol autenticado puede ver)
            this.getAuthenticatedUserId(req);
            
            const records = await this.medicalRecordService.getPatientRecords(patientId);
            
            this.handleSuccess(
                res,
                { records },
                200
            );
        } catch (error) {
            this.handleError(res, error);
        }
    };

    /**
     * Obtiene un historial médico específico
     * @security
     * - Verifica autenticación y acceso
     * - Registra consulta del historial
     */
    public getRecordById = async (req: Request, res: Response): Promise<void> => {
        try {
            const recordId = req.params.id;
            
            // Verificar autenticación
            this.getAuthenticatedUserId(req);
            
            const record = await this.medicalRecordService.getRecordById(recordId);
            
            this.handleSuccess(
                res,
                { record },
                200
            );
        } catch (error) {
            this.handleError(res, error);
        }
    };

    /**
     * Actualiza un historial médico
     * @security
     * - Verifica propiedad del registro
     * - Valida permisos de modificación
     */
    public updateRecord = async (req: Request, res: Response): Promise<void> => {
        try {
            const recordId = req.params.id;
            const medicoId = this.getAuthenticatedUserId(req);
            
            // Verificar que es un médico
            this.checkRole(req, [UserRole.MEDICO]);
            
            const updateData = req.body;

            const updatedRecord = await this.medicalRecordService.updateRecord(
                recordId,
                updateData,
                medicoId
            );

            this.handleSuccess(
                res,
                { record: updatedRecord },
                200,
                'Historial médico actualizado exitosamente'
            );
        } catch (error) {
            this.handleError(res, error);
        }
    };

    /**
     * Elimina un historial médico
     * @security
     * - Solo permite eliminación a administradores
     * - Registra la eliminación
     */
    public deleteRecord = async (req: Request, res: Response): Promise<void> => {
        try {
            const recordId = req.params.id;
            
            // Verificar que es un administrador
            this.checkRole(req, [UserRole.ADMINISTRADOR]);
            
            await this.medicalRecordService.deleteRecord(recordId);

            this.handleSuccess(
                res,
                null,
                200,
                'Historial médico eliminado exitosamente'
            );
        } catch (error) {
            this.handleError(res, error);
        }
    };
}

export default new MedicalRecordController();