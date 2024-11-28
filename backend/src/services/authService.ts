// authService.ts
import { createUser, findUserByEmail } from '../models/userModel';
import bcryptHelper from '../utils/bcryptHelper';
import jwtHelper from '../utils/jwtHelper';

/**
 * Lógica de negocio para registro de usuarios.
 */
export const registerUser = async (nombre: string, email: string, contraseña: string, rol: string) => {
    const hashedPassword = await bcryptHelper.hashPassword(contraseña);
    return await createUser(nombre, email, hashedPassword, rol);
};

/**
 * Lógica de negocio para inicio de sesión.
 */
export const loginUser = async (email: string, contraseña: string) => {
    const user = await findUserByEmail(email);

    if (!user || !(await bcryptHelper.comparePassword(contraseña, user.contraseña))) {
        throw new Error('Credenciales inválidas');
    }

    return jwtHelper.generateToken({ userId: user.id, rol: user.rol });
};
