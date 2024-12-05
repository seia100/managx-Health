import React, { useState } from 'react';
import MedicalHistoryList from '../components/MedicalHistory/MedicalHistoryList';
import MedicalHistoryForm from '../components/MedicalHistory/MedicalHistoryForm';

const MedicalHistory: React.FC = () => {
    const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);

    return (
        <div className="medical-history-page">
        <h1>Medical History</h1>
        {selectedPatientId ? (
            <>
            <MedicalHistoryList patientId={selectedPatientId} />
            <MedicalHistoryForm patientId={selectedPatientId} />
            </>
        ) : (
            <p>Select a patient to view their medical history.</p>
        )}
        </div>
    );
};

export default MedicalHistory;
