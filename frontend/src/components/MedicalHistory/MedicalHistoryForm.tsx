import React, { useState } from 'react';
import { addMedicalHistory, updateMedicalHistory } from '../../services/api';

const MedicalHistoryForm: React.FC<{ patientId: number; historyId?: number }> = ({ patientId, historyId }) => {
    const [description, setDescription] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
        if (historyId) {
            await updateMedicalHistory(historyId, { description });
        } else {
            await addMedicalHistory(patientId, { description });
        }
        alert('History saved successfully');
        } catch (err) {
        console.error('Error saving history:', err);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
        <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
        ></textarea>
        <button type="submit">Save</button>
        </form>
    );
};

export default MedicalHistoryForm;
