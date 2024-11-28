// AuthForm.tsx

// Importa React y hooks necesarios para manejar el estado local del formulario.
import React, { useState } from 'react';
// Importa el hook `useAuth` para acceder a las funciones de autenticación desde el contexto.
import { useAuth } from '../context/AuthContext';

const AuthForm = () => {
    // Obtiene la función `login` del contexto de autenticación.
    const { login } = useAuth();
    
    // Define los estados locales para manejar los valores de email y contraseña.
    const [email, setEmail] = useState('');
    const [contraseña, setContraseña] = useState('');

    /**
     * Función que maneja el envío del formulario.
     * Intenta realizar el login utilizando las credenciales proporcionadas.
     * Si es exitoso, muestra un mensaje de éxito, de lo contrario muestra un mensaje de error.
     * @param e - El evento de envío del formulario.
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Previene el comportamiento por defecto del formulario (recarga de página).
        
        try {
        // Llama a la función `login` del contexto para autenticar al usuario.
        await login(email, contraseña);
        alert('Inicio de sesión exitoso'); // Muestra un mensaje si el login es exitoso.
        } catch (err) {
        alert('Error al iniciar sesión'); // Muestra un mensaje de error si el login falla.
        }
    };

    return (
        <form onSubmit={handleSubmit}>  {/* Se ejecuta la función `handleSubmit` cuando el formulario es enviado */}
        <h1>Iniciar Sesión</h1>
        <div>
            <label>Email:</label>
            <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} // Actualiza el estado de `email` cuando el usuario escribe
            required 
            />
        </div>
        <div>
            <label>Contraseña:</label>
            <input 
            type="password" 
            value={contraseña} 
            onChange={(e) => setContraseña(e.target.value)} // Actualiza el estado de `contraseña` cuando el usuario escribe
            required 
            />
        </div>
        <button type="submit">Ingresar</button> {/* Botón para enviar el formulario */}
        </form>
    );
};

export default AuthForm;
