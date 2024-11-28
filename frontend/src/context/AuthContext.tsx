// AuthContext.tsx

// Importa las dependencias necesarias de React para manejar el contexto de autenticación.
import React, { createContext, useState, useContext, ReactNode } from 'react';
// Importa el servicio de autenticación para interactuar con el backend.
import { login as loginService } from '../services/authService';

// Define la estructura de los datos que manejará el contexto.
interface AuthContextProps {
    isAuthenticated: boolean; // Estado que indica si el usuario está autenticado.
    login: (email: string, contraseña: string) => Promise<void>; // Función para realizar login.
    logout: () => void; // Función para realizar logout.
}

// Crea el contexto de autenticación, inicializado como `undefined` hasta que el proveedor esté presente.
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

/**
 * Proveedor de contexto que envuelve a los componentes hijos con la lógica de autenticación.
 * @param children - Los componentes hijos que podrán acceder al contexto de autenticación.
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    // Estado que determina si el usuario está autenticado (por defecto es `false`).
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    /**
     * Función para iniciar sesión.
     * Realiza la autenticación y guarda el token en `localStorage`.
     * @param email - El correo electrónico del usuario.
     * @param contraseña - La contraseña del usuario.
     */
    const login = async (email: string, contraseña: string) => {
        // Llama al servicio de login, que devuelve un token de autenticación.
        const { token } = await loginService(email, contraseña);
        
        // Guarda el token en el `localStorage` para persistir la sesión entre recargas de página.
        localStorage.setItem('token', token);
        
        // Cambia el estado de autenticación a `true`.
        setIsAuthenticated(true);
    };

    /**
     * Función para cerrar sesión.
     * Elimina el token del `localStorage` y actualiza el estado de autenticación.
     */
    const logout = () => {
        // Elimina el token del `localStorage`, terminando la sesión del usuario.
        localStorage.removeItem('token');
        
        // Cambia el estado de autenticación a `false`.
        setIsAuthenticated(false);
    };

    return (
        // Proporciona el contexto con el estado y las funciones para login/logout.
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children} {/* Renderiza los componentes hijos dentro del proveedor de contexto. */}
        </AuthContext.Provider>
    );
};

/**
 * Hook personalizado para acceder al contexto de autenticación.
 * @returns El contexto de autenticación, que contiene `isAuthenticated`, `login`, y `logout`.
 * @throws Error si se intenta usar el hook fuera de un `AuthProvider`.
 */
export const useAuth = () => {
    const context = useContext(AuthContext);

    // Verifica si el hook se usa fuera del contexto del `AuthProvider`.
    if (!context) {
        throw new Error('useAuth debe usarse dentro de un AuthProvider');
    }

    return context;
};
