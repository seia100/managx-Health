// src/services/appointment.service.ts
import { AppointmentModel, Appointment } from '@/models/appointment.model';
import { ValidationError, NotFoundError } from '@/utils/errors';
import { logger } from '@/utils/logger';
import { APP_CONSTANTS } from '@/config/constants';

export class AppointmentService {
    private appointmentModel: AppointmentModel;

    constructor() {
        this.appointmentModel = new AppointmentModel();
    }

    /**
     * Programa una nueva cita
     * Verifica disponibilidad y validaciones temporales
     */
    public async create(appointmentData: Partial<Appointment>): Promise<Appointment> {
        try {
            // Verificar que la fecha sea futura
            const appointmentDate = new Date(appointmentData.fecha_hora);
            if (appointmentDate <= new Date()) {
                throw new ValidationError('La fecha de la cita debe ser futura');
            }

            // Verificar disponibilidad del médico
            const isAvailable = await this.appointmentModel.checkAvailability(
                appointmentData.medico_id,
                appointmentDate
            );

            if (!isAvailable) {
                throw new ValidationError('El médico no está disponible en ese horario');
            }

            const newAppointment = await this.appointmentModel.create({
                ...appointmentData,
                estado: APP_CONSTANTS.APPOINTMENT_STATUS.SCHEDULED
            });

            logger.info(`Cita programada: ${newAppointment.id}`);
            return newAppointment;
        } catch (error) {
            logger.error('Error programando cita:', error);
            throw error;
        }
    }

    /**
     * Actualiza el estado de una cita
     * Implementa validaciones de estado y permisos
     */
    public async updateStatus(
        id: string,
        status: string
    ): Promise<Appointment> {
        try {
            const appointment = await this.appointmentModel.findById(id);
            if (!appointment) {
                throw new NotFoundError('Cita no encontrada');
            }

            // Validar transiciones de estado permitidas
            if (!this.isValidStatusTransition(appointment.estado, status)) {
                throw new ValidationError('Transición de estado no permitida');
            }

            const updatedAppointment = await this.appointmentModel.updateStatus(id, status);
            logger.info(`Estado de cita actualizado: ${id} -> ${status}`);
            return updatedAppointment;
        } catch (error) {
            logger.error('Error actualizando estado de cita:', error);
            throw error;
        }
    }

    /**
     * Valida si una transición de estado es permitida
     */
    private isValidStatusTransition(currentStatus: string, newStatus: string): boolean {
        const validTransitions = {
            [APP_CONSTANTS.APPOINTMENT_STATUS.SCHEDULED]: [
                APP_CONSTANTS.APPOINTMENT_STATUS.COMPLETED,
                APP_CONSTANTS.APPOINTMENT_STATUS.CANCELLED
            ],
            [APP_CONSTANTS.APPOINTMENT_STATUS.COMPLETED]: [],
            [APP_CONSTANTS.APPOINTMENT_STATUS.CANCELLED]: []
        };

        return validTransitions[currentStatus]?.includes(newStatus) || false;
    }
}