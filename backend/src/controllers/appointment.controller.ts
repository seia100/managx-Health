// src/controllers/appointment.controller.ts
import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import { AppointmentService } from '@/services/appointment.service';
import { TypedRequest } from './types';
import { CreateAppointmentDTO, UpdateAppointmentDTO } from '@/dtos/appointment.dto';
import { APP_CONSTANTS } from '@/config/constants';
import { AppointmentModel } from '@/models/appointment.model';

export class AppointmentController extends BaseController {
    private appointmentService: AppointmentService;
    private appointmentModel: AppointmentModel;

    constructor() {
        super();
        this.appointmentService = new AppointmentService();
        this.appointmentModel = new AppointmentModel();

    }
    

    public create = async (
        req: TypedRequest<CreateAppointmentDTO>,
        res: Response
    ): Promise<Response> => {
        try {
            const appointmentData = {
                ...req.body,
                fecha_hora: new Date(req.body.fecha_hora), // Conversión aquí
            };
    
            const newAppointment = await this.appointmentModel.create(appointmentData);
    
            return BaseController.sendResponse(
                res,
                201,
                true,
                newAppointment,
                'Cita programada exitosamente'
            );
        } catch (error) {
            return BaseController.handleError(res, error);
        }
    };
    

    // public getAll = async (
    //     req: Request,
    //     res: Response
    // ): Promise<Response> => {
    //     try {
    //         const page = Number(req.query.page) || 1;
    //         const limit = Number(req.query.limit) || 10;
    
    //         const { data, total } = await this.appointmentModel.findAll(page, limit);
    
    //         return BaseController.sendResponse(
    //             res,
    //             200,
    //             true,
    //             { data, total },
    //             'Citas recuperadas exitosamente'
    //         );
    //     } catch (error) {
    //         return BaseController.handleError(res, error);
    //     }
    // };
    

    public getById = async (
        req: Request,
        res: Response
    ): Promise<Response> => {
        try {
            const appointmentId = req.params.id;
            const appointment = await this.appointmentModel.findById(appointmentId);
    
            if (!appointment) {
                return BaseController.sendResponse(
                    res,
                    404,
                    false,
                    null,
                    'Cita no encontrada'
                );
            }
    
            return BaseController.sendResponse(
                res,
                200,
                true,
                appointment,
                'Cita recuperada exitosamente'
            );
        } catch (error) {
            return BaseController.handleError(res, error);
        }
    };

    public update = async (
        req: TypedRequest<UpdateAppointmentDTO>,
        res: Response
    ): Promise<Response> => {
        try {
            const appointmentId = req.params.id;
            const appointmentData = {
                ...req.body,
                fecha_hora: req.body.fecha_hora ? new Date(req.body.fecha_hora) : undefined, // Convertir fecha_hora
            };
    
            const updatedAppointment = await this.appointmentModel.update(
                appointmentId,
                appointmentData
            );
    
            if (!updatedAppointment) {
                return BaseController.sendResponse(
                    res,
                    404,
                    false,
                    null,
                    'Cita no encontrada para actualizar'
                );
            }
    
            return BaseController.sendResponse(
                res,
                200,
                true,
                updatedAppointment,
                'Cita actualizada exitosamente'
            );
        } catch (error) {
            return BaseController.handleError(res, error);
        }
    };
    
    public cancel = async (
        req: Request,
        res: Response
    ): Promise<Response> => {
        try {
            const appointmentId = req.params.id;
            const canceledAppointment = await this.appointmentService.updateStatus(
                appointmentId,
                APP_CONSTANTS.APPOINTMENT_STATUS.CANCELLED
            );

            return BaseController.sendResponse(
                res,
                200,
                true,
                canceledAppointment,
                'Cita cancelada exitosamente'
            );
        } catch (error) {
            return BaseController.handleError(res, error);
        }
    }

    public complete = async (
        req: Request,
        res: Response
    ): Promise<Response> => {
        try {
            const appointmentId = req.params.id;
            const completedAppointment = await this.appointmentService.updateStatus(
                appointmentId,
                APP_CONSTANTS.APPOINTMENT_STATUS.COMPLETED
            );

            return BaseController.sendResponse(
                res,
                200,
                true,
                completedAppointment,
                'Cita marcada como completada exitosamente'
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
            const appointments = await this.appointmentModel.findByPatientId(patientId);

            return BaseController.sendResponse(
                res,
                200,
                true,
                appointments,
                'Citas del paciente recuperadas exitosamente'
            );
        } catch (error) {
            return BaseController.handleError(res, error);
        }
    }

    public getByDoctorId = async (
        req: Request,
        res: Response
    ): Promise<Response> => {
        try {
            const doctorId = req.params.doctorId;
            const { date } = req.query;
            
            const appointments = await this.appointmentModel.findByDoctorId(
                doctorId,
                date as string
            );

            return BaseController.sendResponse(
                res,
                200,
                true,
                appointments,
                'Citas del médico recuperadas exitosamente'
            );
        } catch (error) {
            return BaseController.handleError(res, error);
        }
    }
}