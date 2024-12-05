import React, { useState } from 'react';
import { createAppointment, updateAppointment } from '../../services/api';

const AppointmentForm: React.FC<{ appointmentId?: number }> = ({ appointmentId }) => {
    const [formData, setFormData] = useState({ date: '', time: '', description: '' });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
        if (appointmentId) {
            await updateAppointment(appointmentId, formData);
        } else {
            await createAppointment(formData);
        }
        alert('Appointment saved successfully');
        } catch (err) {
        console.error('Error saving appointment:', err);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
        <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
        />
        <input
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            required
        />
        <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        ></textarea>
        <button type="submit">Save</button>
        </form>
    );
};

export default AppointmentForm;
