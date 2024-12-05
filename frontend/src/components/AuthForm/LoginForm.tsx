import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const LoginForm: React.FC = () => {
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
        await login(email, password);
        } catch (err) {
        console.error('Login failed:', err);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
        <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
        />
        <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
        />
        <button type="submit">Login</button>
        </form>
    );
};

export default LoginForm;
