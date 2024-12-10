// src/controllers/medical-history.controller.ts
import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import { MedicalHistoryService } from '@/services/medical-history.service';
import { TypedRequest } from './types';
import { CreateMedicalHistoryDTO, UpdateMedicalHistoryDTO } from '../dtos/medical-history.dto';

export class MedicalHistoryController extends BaseController {
    private medicalHistoryService: MedicalHistoryService;

    constructor() {
        super();
        this.medicalHistoryService = new MedicalHistoryService();
    }

    public create = async (
        req: TypedRequest<CreateMedicalHistoryDTO>,
        res: Response
    ): Promise<Response> => {
        try {
            const data = req.body;
            const historial = await this.medicalHistoryService.create(data);

            return BaseController.sendResponse(
                res,
                201,
                true,
                historial,
                'Historial médico creado exitosamente'
            );
        } catch (error) {
            return BaseController.handleError(res, error);
        }
    }

    public getByPatientId = async (
        req: Request,
        res: Response
    ): Promise<Response> => {
        try {
            const patientId = req.params.patientId;
            const historiales = await this.medicalHistoryService.findByPatientId(patientId);

            return BaseController.sendResponse(
                res,
                200,
                true,
                historiales,
                'Historiales médicos recuperados exitosamente'
            );
        } catch (error) {
            return BaseController.handleError(res, error);
        }
    }

    public getById = async (
        req: Request,
        res: Response
    ): Promise<Response> => {
        try {
            const id = req.params.id;
            const historial = await this.medicalHistoryService.findById(id);

            if (!historial) {
                return BaseController.sendResponse(
                    res,
                    404,
                    false,
                    null,
                    'Historial médico no encontrado'
                );
            }

            return BaseController.sendResponse(
                res,
                200,
                true,
                historial,
                'Historial médico recuperado exitosamente'
            );
        } catch (error) {
            return BaseController.handleError(res, error);
        }
    }

    public update = async (
        req: TypedRequest<UpdateMedicalHistoryDTO>,
        res: Response
    ): Promise<Response> => {
        try {
            const id = req.params.id;
            const data = req.body;
            const updatedHistory = await this.medicalHistoryService.update(id, data);

            return BaseController.sendResponse(
                res,
                200,
                true,
                updatedHistory,
                'Historial médico actualizado exitosamente'
            );
        } catch (error) {
            return BaseController.handleError(res, error);
        }
    }

    public delete = async (
        req: Request,
        res: Response
    ): Promise<Response> => {
        try {
            const id = req.params.id;
            await this.medicalHistoryService.delete(id);

            return BaseController.sendResponse(
                res,
                200,
                true,
                null,
                'Historial médico eliminado exitosamente'
            );
        } catch (error) {
            return BaseController.handleError(res, error);
        }
    }

    public attachFile = async (
        req: Request,
        res: Response
    ): Promise<Response> => {
        try {
            const id = req.params.id;
            const file = req.file;

            if (!file) {
                return BaseController.sendResponse(
                    res,
                    400,
                    false,
                    null,
                    'No se proporcionó ningún archivo'
                );
            }

            const updatedHistory = await this.medicalHistoryService.attachFile(id, file);

            return BaseController.sendResponse(
                res,
                200,
                true,
                updatedHistory,
                'Archivo adjuntado exitosamente'
            );
        } catch (error) {
            return BaseController.handleError(res, error);
        }
    }
}