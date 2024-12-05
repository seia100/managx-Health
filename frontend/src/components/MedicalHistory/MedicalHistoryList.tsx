import React, { useState, useEffect } from 'react';
import { fetchMedicalHistory } from '../../services/api';

const MedicalHistoryList: React.FC<{ patientId: number }> = ({ patientId }) => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const loadHistory = async () => {
        const data = await fetchMedicalHistory(patientId);
        setHistory(data);
        };
        loadHistory();
    }, [patientId]);

    return (
        <div>
        <h2>Medical History</h2>
        <ul>
            {history.map((record: any) => (
            <li key={record.id}>{record.description}</li>
            ))}
        </ul>
        </div>
    );
};

export default MedicalHistoryList;
