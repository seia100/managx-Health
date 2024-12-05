import React, { useState } from 'react';
import { updatePatient } from '../../services/api';

interface PatientFormData {
    name: string;
    age: number;
    contact: string;
}

const PatientForm: React.FC<{ patientId: number }> = ({ patientId }) => {
    const [formData, setFormData] = useState<PatientFormData>({
        name: '',
        age: 0,
        contact: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
        await updatePatient(patientId, formData);
        alert('Patient updated successfully');
        } catch (err) {
        console.error('Error updating patient:', err);
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
            onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
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
