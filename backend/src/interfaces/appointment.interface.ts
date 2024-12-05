// src/interfaces/appointment.interface.ts
export interface IAppointment {
    id: string;
    paciente_id: string;
    medico_id: string;
    fecha_hora: Date;
    motivo: string;
    estado: 'PROGRAMADA' | 'COMPLETADA' | 'CANCELADA';
    notas?: string;
    created_at: Date;
    updated_at: Date;
}

export interface IAppointmentCreate extends Omit<IAppointment, 'id' | 'created_at' | 'updated_at'> {}
export interface IAppointmentUpdate extends Partial<Omit<IAppointment, 'id' | 'created_at' | 'updated_at'>> {}
export interface IAppointmentFilters {
    page: number;
    limit: number;
    fecha_inicio?: string;
    fecha_fin?: string;
    estado?: string;
}