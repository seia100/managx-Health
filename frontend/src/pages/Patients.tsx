import React, { useState, useEffect } from 'react';
import PatientList from '../components/PatientManagement/PatientList';
import PatientForm from '../components/PatientManagement/PatientForm';
import { fetchPatients } from '../services/api';
  
const Patients: React.FC = () => {
    const [patients, setPatients] = useState<{ id: number; name: string }[]>([]);
    const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);

    // Carga la lista de pacientes al cargar la página
    useEffect(() => {
        const loadPatients = async () => {
        try {
            const data = await fetchPatients();
            setPatients(data);
        } catch (error) {
            console.error('Error fetching patients:', error);
        }
        };
        loadPatients();
    }, []);

    // Función para manejar la selección de un paciente
    const handleSelectPatient = (patientId: number) => {
        setSelectedPatientId(patientId);
    };

    // Función para limpiar la selección (al agregar un nuevo paciente)
    const handleClearSelection = () => {
        setSelectedPatientId(null);
    };

    return (
        <div>
        <h1>Patients</h1>
        {/* Lista de pacientes */}
        <PatientList patients={patients} onSelectPatient={handleSelectPatient} />

        <h2>{selectedPatientId ? 'Edit Patient' : 'Add New Patient'}</h2>
        {/* Formulario de pacientes */}
        <PatientForm patientId={selectedPatientId} onClearSelection={handleClearSelection} />
        </div>
    );
};

export default Patients;
