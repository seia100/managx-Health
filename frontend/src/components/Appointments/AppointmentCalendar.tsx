import React from 'react';
import Calendar, { CalendarProps } from 'react-calendar';

const AppointmentCalendar: React.FC<{ onDateClick: (date: Date) => void }> = ({ onDateClick }) => {
    const handleDateChange: CalendarProps['onChange'] = (value) => {
        if (value instanceof Date) {
            onDateClick(value); // Solo llama si el valor es una fecha válida
        }
    };
    return <Calendar onChange={handleDateChange} />;
};

export default AppointmentCalendar;
