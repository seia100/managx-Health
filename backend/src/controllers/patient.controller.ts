// src/controllers/patient.controller.ts
import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import { PatientService } from '@/services/patient.service';
import { TypedRequest } from './types';
import { CreatePatientDTO, UpdatePatientDTO } from '@/dtos/patient.dto';

export class PatientController extends BaseController {
    private patientService: PatientService;

    constructor() {
        super();
        this.patientService = new PatientService();
    }

    public create = async (
        req: TypedRequest<CreatePatientDTO>,
        res: Response
    ): Promise<Response> => {
        try {
            const patientData = req.body;
            const newPatient = await this.patientService.create(patientData);

            return BaseController.sendResponse(
                res,
                201,
                true,
                newPatient,
                'Paciente creado exitosamente'
            );
        } catch (error) {
            return BaseController.handleError(res, error);
        }
    }

    public getAll = async (
        req: Request,
        res: Response
    ): Promise<Response> => {
        try {
            const { page = 1, limit = 10 } = req.query;
            const patients = await this.patientService.findAll(
                Number(page),
                Number(limit)
            );

            return BaseController.sendResponse(
                res,
                200,
                true,
                patients,
                'Pacientes recuperados exitosamente'
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
            const patientId = req.params.id;
            const patient = await this.patientService.findById(patientId);

            if (!patient) {
                return BaseController.sendResponse(
                    res,
                    404,
                    false,
                    null,
                    'Paciente no encontrado'
                );
            }

            return BaseController.sendResponse(
                res,
                200,
                true,
                patient,
                'Paciente recuperado exitosamente'
            );
        } catch (error) {
            return BaseController.handleError(res, error);
        }
    }

    public update = async (
        req: TypedRequest<UpdatePatientDTO>,
        res: Response
    ): Promise<Response> => {
        try {
            const patientId = req.params.id;
            const patientData = req.body;
            const updatedPatient = await this.patientService.update(
                patientId,
                patientData
            );

            return BaseController.sendResponse(
                res,
                200,
                true,
                updatedPatient,
                'Paciente actualizado exitosamente'
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
            const patientId = req.params.id;
            await this.patientService.delete(patientId);

            return BaseController.sendResponse(
                res,
                200,
                true,
                null,
                'Paciente eliminado exitosamente'
            );
        } catch (error) {
            return BaseController.handleError(res, error);
        }
    }
}