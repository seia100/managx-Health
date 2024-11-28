// login.tsx

// Importa React y el componente `AuthForm` para mostrar el formulario de inicio de sesión.
import React from 'react';
import AuthForm from '../components/AuthForm';

/**
 * Componente de la página de inicio de sesión.
 * Este componente contiene el formulario de autenticación `AuthForm` que permite al usuario iniciar sesión.
 */
const LoginPage = () => {
    return (
        <div>
        {/* Renderiza el formulario de autenticación */}
        <AuthForm />
        </div>
    );
};

export default LoginPage;

