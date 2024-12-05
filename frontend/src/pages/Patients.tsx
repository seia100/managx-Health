import React from 'react';
import PatientList from '../components/PatientManagement/PatientList';
import PatientForm from '../components/PatientManagement/PatientForm';

const Patients: React.FC = () => {
    return (
        <div className="patients-page">
        <h1>Patients</h1>
        <PatientList />
        <h2>Add / Edit Patient</h2>
        <PatientForm />
        </div>
    );
};

export default Patients;
