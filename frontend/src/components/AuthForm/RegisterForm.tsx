import React, { useState } from 'react';
import { register } from '../../services/api';

const RegisterForm: React.FC = () => {
    const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '' });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match');
        return;
        }
        try {
        await register(formData.email, formData.password);
        alert('Registration successful');
        } catch (err) {
        console.error('Registration failed:', err);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
        <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
        />
        <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
        />
        <input
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            required
        />
        <button type="submit">Register</button>
        </form>
    );
};

export default RegisterForm;
