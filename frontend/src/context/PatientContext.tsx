import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import { fetchPatients, createPatient, updatePatient } from '../services/api';

interface Patient {
    id: number;
    name: string;
    age: number;
    contact: string;
}

interface PatientContextType {
    patients: Patient[];
    addPatient: (data: Omit<Patient, 'id'>) => Promise<void>;
    editPatient: (id: number, data: Omit<Patient, 'id'>) => Promise<void>;
    refreshPatients: () => Promise<void>;
}

export const PatientContext = createContext<PatientContextType>({
    patients: [],
    addPatient: async () => {},
    editPatient: async () => {},
    refreshPatients: async () => {},
});

export const PatientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [patients, setPatients] = useState<Patient[]>([]);

    // Función para cargar pacientes
    const refreshPatients = async () => {
        const data = await fetchPatients();
        setPatients(data);
    };

    useEffect(() => {
        refreshPatients();
    }, []);

    // Función para agregar un paciente
    const addPatient = async (data: Omit<Patient, 'id'>) => {
        await createPatient(data);
        await refreshPatients();
    };

    // Función para editar un paciente
    const editPatient = async (id: number, data: Omit<Patient, 'id'>) => {
        await updatePatient(id, data);
        await refreshPatients();
    };

    // Memoización del valor proporcionado
    const contextValue = useMemo(
        () => ({
        patients,
        addPatient,
        editPatient,
        refreshPatients,
        }),
        [patients] // Solo se recalcula si `patients` cambia
    );

    return <PatientContext.Provider value={contextValue}>{children}</PatientContext.Provider>;
};

// Hook personalizado para usar el contexto
export const usePatient = () => useContext(PatientContext);
