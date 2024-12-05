import React, { useState } from 'react';
import AppointmentCalendar from '../components/Appointments/AppointmentCalendar';
import AppointmentForm from '../components/Appointments/AppointmentForm';

const Appointments: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const handleDateClick = (date: Date) => {
        setSelectedDate(date);
    };

    return (
        <div className="appointments-page">
        <h1>Appointments</h1>
        <AppointmentCalendar onDateClick={handleDateClick} />
        {selectedDate && (
            <>
            <h2>Selected Date: {selectedDate.toDateString()}</h2>
            <AppointmentForm />
            </>
        )}
        </div>
    );
};

export default Appointments;
