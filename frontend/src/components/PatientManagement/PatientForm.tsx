import React, { useState, useEffect } from 'react';
import { createPatient, updatePatient } from '../../services/api';

interface PatientFormData {
    name: string;
    age: number;
    contact: string;
}

interface PatientFormProps {
    patientId: number | null; // null cuando se está creando un nuevo paciente
    onClearSelection: () => void; // Función para limpiar la selección
}

const PatientForm: React.FC<PatientFormProps> = ({ patientId, onClearSelection }) => {
    const [formData, setFormData] = useState<PatientFormData>({
        name: '',
        age: 0,
        contact: '',
    });

    // Maneja los cambios cuando cambia el `patientId`
    useEffect(() => {
        if (patientId) {
        // Aquí puedes cargar los datos del paciente si el backend soporta un endpoint de "getPatientById"
        console.log(`Editing patient with ID: ${patientId}`);
        } else {
        // Limpia el formulario para la creación de un nuevo paciente
        setFormData({ name: '', age: 0, contact: '' });
        }
    }, [patientId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
        if (patientId) {
            // Actualiza un paciente existente
            await updatePatient(patientId, formData);
            alert('Patient updated successfully');
        } else {
            // Crea un nuevo paciente
            await createPatient(formData);
            alert('Patient created successfully');
        }
        onClearSelection(); // Limpia la selección después de guardar
        } catch (err) {
        console.error('Error saving patient:', err);
        alert('An error occurred while saving the patient.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
        <div>
            <label htmlFor="name">Name</label>
            <input
            id="name"
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            />
        </div>
        <div>
            <label htmlFor="age">Age</label>
            <input
            id="age"
            type="number"
            placeholder="Age"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
            required
            />
        </div>
        <div>
            <label htmlFor="contact">Contact</label>
            <input
            id="contact"
            type="text"
            placeholder="Contact"
            value={formData.contact}
            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
            required
            />
        </div>
        <div>
            <button type="submit">{patientId ? 'Update Patient' : 'Add Patient'}</button>
            {patientId && (
            <button type="button" onClick={onClearSelection}>
                Cancel
            </button>
            )}
        </div>
        </form>
    );
};

export default PatientForm;
