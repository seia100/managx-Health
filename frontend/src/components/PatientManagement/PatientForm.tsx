import React, { useState } from 'react';
import { createPatient, updatePatient } from '../../services/api';

const PatientForm: React.FC<{ patientId?: number }> = ({ patientId }) => {
    const [formData, setFormData] = useState({ name: '', age: '', contact: '' });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formattedData = {
            ...formData,
            age: Number(formData.age), // Convierte age a número
        };

        try {
            if (patientId) {
                await updatePatient(patientId, formattedData);
                alert('Patient updated successfully');
            } else {
                await createPatient(formattedData);
            }
            alert('Patient saved successfully');
        } catch (err) {
            console.error('Error saving patient:', err);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
        <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
        />
        <input
            type="number"
            placeholder="Age"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            required
        />
        <input
            type="text"
            placeholder="Contact"
            value={formData.contact}
            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
            required
        />
        <button type="submit">Save</button>
        </form>
    );
};

export default PatientForm;
