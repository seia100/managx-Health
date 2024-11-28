// api.ts
import axios from 'axios';

// Configura la instancia de Axios
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Middleware para manejar errores globalmente
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
        // Redirigir al login si el token es inválido
        window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
