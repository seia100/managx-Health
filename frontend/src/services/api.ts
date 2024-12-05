import axios from 'axios';

// Configuración inicial del cliente Axios
const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Middleware para incluir el token de autenticación en las solicitudes
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// --- Funciones relacionadas con Autenticación ---
export const login = async (email: string, password: string) => {
    const response = await apiClient.post('/auth/login', { email, password });
    localStorage.setItem('authToken', response.data.token); // Guarda el token
    return response.data;
};

export const register = async (email: string, password: string) => {
    const response = await apiClient.post('/auth/register', { email, password });
    return response.data;
};

// --- Funciones relacionadas con el Usuario ---
export const fetchUserProfile = async () => {
    const response = await apiClient.get('/users/me');
    return response.data;
};

export const updateUserProfile = async (data: { name: string; email: string }) => {
    const response = await apiClient.put('/users/me', data);
    return response.data;
};

// --- Funciones relacionadas con Pacientes ---
export const fetchPatients = async () => {
    const response = await apiClient.get('/patients');
    return response.data;
};

export const createPatient = async (data: { name: string; age: number; contact: string }) => {
    const response = await apiClient.post('/patients', data);
    return response.data;
};

export const updatePatient = async (id: number, data: { name: string; age: number; contact: string }) => {
    const response = await apiClient.put(`/patients/${id}`, data);
    return response.data;
};

// --- Funciones relacionadas con Historiales Médicos ---
export const fetchMedicalHistory = async (patientId: number) => {
    const response = await apiClient.get(`/patients/${patientId}/medical-history`);
    return response.data;
};

export const addMedicalHistory = async (patientId: number, data: { description: string }) => {
    const response = await apiClient.post(`/patients/${patientId}/medical-history`, data);
    return response.data;
};

export const updateMedicalHistory = async (
    historyId: number,
    data: { description: string }
) => {
    const response = await apiClient.put(`/medical-history/${historyId}`, data);
    return response.data;
};

// --- Funciones relacionadas con Citas ---
export const createAppointment = async (data: { date: string; time: string; description: string }) => {
    const response = await apiClient.post('/appointments', data);
    return response.data;
};

export const updateAppointment = async (
    appointmentId: number,
    data: { date: string; time: string; description: string }
) => {
    const response = await apiClient.put(`/appointments/${appointmentId}`, data);
    return response.data;
};
