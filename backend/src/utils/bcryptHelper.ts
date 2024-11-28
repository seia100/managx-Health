// Importa bcrypt, una librería para manejar el hashing de contraseñas de manera segura.
import bcrypt from 'bcrypt';

// Define el número de rondas de "sal" para el algoritmo bcrypt.
// Un número más alto mejora la seguridad pero incrementa el tiempo de procesamiento.
const SALT_ROUNDS = 10;

/**
 * Exporta un conjunto de funciones para manejar hashing y comparación de contraseñas.
 * Estas funciones encapsulan el uso de bcrypt para mantener la lógica centralizada y reutilizable.
 */
export default {
    /**
     * Genera un hash seguro para una contraseña proporcionada.
     * @param password - Contraseña en texto plano que debe ser encriptada.
     * @returns El hash generado de la contraseña.
     */
    hashPassword: async (password: string) => bcrypt.hash(password, SALT_ROUNDS),

    /**
     * Compara una contraseña en texto plano con un hash almacenado.
     * @param password - Contraseña en texto plano proporcionada por el usuario.
     * @param hash - Hash almacenado que representa la contraseña original.
     * @returns `true` si la contraseña coincide con el hash, de lo contrario `false`.
     */
    comparePassword: async (password: string, hash: string) => bcrypt.compare(password, hash),
};
