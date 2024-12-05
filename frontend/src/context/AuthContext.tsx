import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import { login as apiLogin, fetchUserProfile } from '../services/api';

// Tipo para el contexto
interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

// Creación del contexto
export const AuthContext = createContext<AuthContextType>({
    user: null,
    login: async () => {},
    logout: () => {},
    isAuthenticated: false,
});

// Componente Provider
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    // Estado para controlar si se está cargando la autenticación
    const [loading, setLoading] = useState(true);

    // Cargar información del usuario desde el backend si existe un token
    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem('authToken');
            if (token) {
                try {
                const profile = await fetchUserProfile();
                setUser(profile);
                } catch (err) {
                console.error('Error loading user:', err);
                localStorage.removeItem('authToken');
                }
            }
            setLoading(false); // Finaliza el estado de carga
        };
        loadUser();
    }, []);

    // Función para iniciar sesión
    const login = async (email: string, password: string) => {
        try {
            await apiLogin(email, password);
            const profile = await fetchUserProfile();
            setUser(profile);
        } catch (err) {
            console.error('Login failed:', err);
            throw new Error('Invalid credentials');
        }
    };

    // Función para cerrar sesión
    const logout = () => {
        setUser(null);
        localStorage.removeItem('authToken');
    };

    // Determinar si el usuario está autenticado
    const isAuthenticated = !!user;

    // Memoización del valor proporcionado
    const contextValue = useMemo(
        () => ({
            user,
            login,
            logout,
            isAuthenticated,
        }),
        [user, isAuthenticated] // Solo se recalcula si cambia `user` o `isAuthenticated`
    );

    if (loading) {
        return <div>Loading...</div>; // Puedes reemplazar con un componente de carga
    }

    return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

// Hook personalizado para usar el contexto
export const useAuth = () => useContext(AuthContext);
