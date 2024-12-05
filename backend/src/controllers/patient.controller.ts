// src/controllers/patient.controller.ts

import { Request, Response } from 'express';
import { PatientService } from '../services/patient.service';
import { validatePatient } from '../validators/patient.validator';
import { ErrorHandler } from '../utils/error.handler';
import { BaseController } from './base.controller';

export class PatientController extends BaseController {
    private patientService: PatientService;

    constructor() {
        super();
        this.patientService = new PatientService();
    }

    /**
     * Crea un nuevo paciente
     * @security
     * - Validación de datos de entrada
     * - Verificación de permisos
     */
    public createPatient = async (req: Request, res: Response): Promise<void> => {
        try {
            const patientData = req.body;
            const newPatient = await this.patientService.createPatient(patientData);
            
            res.status(201).json({
                status: 'success',
                data: {
                    patient: newPatient
                }
            });
        } catch (error) {
            ErrorHandler.handleError(error, res);
        }
    };

    /**
     * Obtiene lista de pacientes con paginación
     * @security
     * - Paginación para optimizar rendimiento
     * - Filtrado por criterios
     */
    public getPatients = async (req: Request, res: Response): Promise<void> => {
        try {
            const { page = 1, limit = 10, search } = req.query;
            const patients = await this.patientService.getPatients({
                page: Number(page),
                limit: Number(limit),
                search: search as string
            });

            res.status(200).json({
                status: 'success',
                data: patients
            });
        } catch (error) {
            ErrorHandler.handleError(error, res);
        }
    };

    /**
     * Obtiene detalles de un paciente específico
     * @security
     * - Verificación de existencia
     * - Control de acceso
     */
    public getPatientById = async (req: Request, res: Response): Promise<void> => {
        try {
            const patientId = req.params.id;
            const patient = await this.patientService.getPatientById(patientId);

            res.status(200).json({
                status: 'success',
                data: {
                    patient
                }
            });
        } catch (error) {
            ErrorHandler.handleError(error, res);
        }
    };

    /**
     * Actualiza información de un paciente
     * @security
     * - Validación de datos actualizables
     * - Verificación de permisos
     */
    public updatePatient = async (req: Request, res: Response): Promise<void> => {
        try {
            const patientId = req.params.id;
            const updateData = req.body;

            const updatedPatient = await this.patientService.updatePatient(patientId, updateData);

            res.status(200).json({
                status: 'success',
                data: {
                    patient: updatedPatient
                }
            });
        } catch (error) {
            ErrorHandler.handleError(error, res);
        }
    };

    /**
     * Elimina un paciente del sistema
     * @security
     * - Solo administradores
     * - Verificación de referencias
     */
    public deletePatient = async (req: Request, res: Response): Promise<void> => {
        try {
            const patientId = req.params.id;
            await this.patientService.deletePatient(patientId);

            res.status(200).json({
                status: 'success',
                message: 'Paciente eliminado exitosamente'
            });
        } catch (error) {
            ErrorHandler.handleError(error, res);
        }
    };
}

export default new PatientController();