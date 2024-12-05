// src/interfaces/medical-record.interface.ts

interface IMedicalRecord {
    id: string;
    paciente_id: string;
    medico_id: string;
    descripcion: string;
    fecha: Date;
    diagnostico?: string;
    tratamiento?: string;
    archivos_adjuntos?: any;
    created_at: Date;
    updated_at: Date;
}

interface IMedicalRecordCreate extends Omit<IMedicalRecord, 'id' | 'created_at' | 'updated_at' | 'fecha'> {}
interface IMedicalRecordUpdate extends Partial<IMedicalRecordCreate> {}