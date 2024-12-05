import React, { useEffect, useState } from 'react';
import { fetchPatients } from '../../services/api';

interface Patient {
        id: number;
        name: string;
    }
    
    interface PatientListProps {
        patients: Patient[]; // Incluye la lista de pacientes como propiedad
        onSelectPatient: (patientId: number) => void; // Función para manejar la selección del paciente
    }

const PatientList: React.FC<PatientListProps> = ({ onSelectPatient }) => {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [search, setSearch] = useState('');

    // Carga la lista de pacientes desde el backend
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

    // Filtra la lista de pacientes según el término de búsqueda
    const filteredPatients = patients.filter((patient) =>
        patient.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
        <h2>Patients</h2>
        {/* Campo de búsqueda */}
        <input
            type="text"
            placeholder="Search patients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
        />
        {/* Lista de pacientes filtrados */}
        <ul>
            {filteredPatients.map((patient) => (
            <li key={patient.id}>
                {/* Al hacer clic en un paciente, lo selecciona */}
                <button onClick={() => onSelectPatient(patient.id)}>{patient.name}</button>
            </li>
            ))}
        </ul>
        </div>
    );
};

export default PatientList;
