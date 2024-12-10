// src/types/enums.ts
/**
 * Enumeraciones que definen valores constantes utilizados en toda la aplicación.
 * Ayudan a mantener la consistencia y prevenir errores de escritura.
 */
export enum UserRole {
    ADMIN = 'ADMINISTRADOR',
    DOCTOR = 'MEDICO',
    NURSE = 'ENFERMERO'
}

export enum AppointmentStatus {
    SCHEDULED = 'PROGRAMADA',
    COMPLETED = 'COMPLETADA',
    CANCELLED = 'CANCELADA'
}

export enum BloodType {
    A_POSITIVE = 'A+',
    A_NEGATIVE = 'A-',
    B_POSITIVE = 'B+',
    B_NEGATIVE = 'B-',
    AB_POSITIVE = 'AB+',
    AB_NEGATIVE = 'AB-',
    O_POSITIVE = 'O+',
    O_NEGATIVE = 'O-'
}