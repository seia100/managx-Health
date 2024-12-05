// src/controllers/appointment.controller.ts
import { Request, Response } from 'express';
import { AppointmentService } from '../services/appointment.service';
import { ErrorHandler } from '../utils/error.handler';
import { AuthBaseController } from './auth.base.controller';
import '../types'; // Importamos los tipos personalizados

export class AppointmentController extends AuthBaseController {
    private appointmentService: AppointmentService;

    constructor() {
        super();
        this.appointmentService = new AppointmentService();
    }

    /**
     * Crea una nueva cita
     * @security
     * - Verificación de disponibilidad
     * - Validación de datos
     * - Control de acceso
     */
    public createAppointment = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = this.getAuthenticatedUserId(req);
            
            const appointmentData = {
                ...req.body,
                medico_id: userId
            };

            const newAppointment = await this.appointmentService.createAppointment(appointmentData);
            
            this.handleSuccess(
                res, 
                { appointment: newAppointment }, 
                201, 
                'Cita creada exitosamente'
            );
        } catch (error) {
            this.handleError(res, error);
        }
    };
    /**
     * Obtiene todas las citas con filtros
     * @security
     * - Paginación
     * - Filtrado por fecha y estado
     */
    public getAppointments = async (req: Request, res: Response): Promise<void> => {
        try {
            const { page = 1, limit = 10, fecha_inicio, fecha_fin, estado } = req.query;
            
            const appointments = await this.appointmentService.getAppointments({
                page: Number(page),
                limit: Number(limit),
                fecha_inicio: fecha_inicio as string,
                fecha_fin: fecha_fin as string,
                estado: estado as string
            });

            res.status(200).json({
                status: 'success',
                data: appointments
            });
        } catch (error) {
            ErrorHandler.handleError(error, res);
        }
    };

    /**
     * Obtiene una cita específica por ID
     */
    public getAppointmentById = async (req: Request, res: Response): Promise<void> => {
        try {
            const appointmentId = req.params.id;
            const appointment = await this.appointmentService.getAppointmentById(appointmentId);

            res.status(200).json({
                status: 'success',
                data: {
                    appointment
                }
            });
        } catch (error) {
            ErrorHandler.handleError(error, res);
        }
    };

    /**
     * Actualiza una cita existente
     */
    public updateAppointment = async (req: Request, res: Response): Promise<void> => {
        try {
            const appointmentId = req.params.id;
            const userId = this.getAuthenticatedUserId(req);
            const updateData = req.body;

            const updatedAppointment = await this.appointmentService.updateAppointment(
                appointmentId,
                updateData,
                userId
            );

            this.handleSuccess(
                res,
                { appointment: updatedAppointment },
                200,
                'Cita actualizada exitosamente'
            );
        } catch (error) {
            this.handleError(res, error);
        }
    };

    /**
     * Cancela una cita programada
     */

    public cancelAppointment = async (req: Request, res: Response): Promise<void> => {
        try {
            const appointmentId = req.params.id;
            const userId = this.getAuthenticatedUserId(req);

            await this.appointmentService.cancelAppointment(appointmentId, userId);

            this.handleSuccess(
                res,
                null,
                200,
                'Cita cancelada exitosamente'
            );
        } catch (error) {
            this.handleError(res, error);
        }
    };
}

export default new AppointmentController();