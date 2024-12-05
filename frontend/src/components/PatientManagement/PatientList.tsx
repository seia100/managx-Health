import React, { useEffect, useState } from 'react';
import { fetchPatients } from '../../services/api';

const PatientList: React.FC = () => {
    const [patients, setPatients] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const loadPatients = async () => {
        const data = await fetchPatients();
        setPatients(data);
        };
        loadPatients();
    }, []);

    const filteredPatients = patients.filter((patient: any) =>
        patient.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
        <h2>Patients</h2>
        <input
            type="text"
            placeholder="Search patients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
        />
        <ul>
            {filteredPatients.map((patient: any) => (
            <li key={patient.id}>{patient.name}</li>
            ))}
        </ul>
        </div>
    );
};

export default PatientList;
