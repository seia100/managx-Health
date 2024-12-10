// src/utils/encryption.ts
import bcrypt, { hashSync } from 'bcryptjs';
import crypto from 'crypto';

/**
 * Utilidades de encriptación para manejar contraseñas y datos sensibles
 * de manera segura.
 * 
 * Implementa:
 * - Hash de contraseñas con salt
 * - Comparación segura de contraseñas
 * - Encriptación y desencriptación de datos sensibles
 * 
 */

// Constantes
const SALT_ROUNDS = 10;
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'your-encryption-key';
const ALGORITHM = 'aes-256-gcm';

/**
 * Exportamos la función directamente
 * Genera un hash seguro de una contraseña
 */
export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compara una contraseña con su hash
 */
export async function  comparePasswords(
    password: string,
    hash: string
): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

export class Encryption {
    private static readonly SALT_ROUNDS = SALT_ROUNDS;
    private static readonly ENCRYPTION_KEY = ENCRYPTION_KEY;
    private static readonly ALGORITHM = ALGORITHM;



    /**
     * Encripta datos sensibles (por ejemplo, información médica)
     */
    public static encryptData(data: string): {
        encryptedData: string;
        iv: string;
        authTag: string;
    } {
        const iv = crypto.randomBytes(12);
        const cipher = crypto.createCipheriv(
            this.ALGORITHM,
            Buffer.from(this.ENCRYPTION_KEY),
            iv
        );

        let encryptedData = cipher.update(data, 'utf8', 'hex');
        encryptedData += cipher.final('hex');

        return {
            encryptedData,
            iv: iv.toString('hex'),
            authTag: (cipher as any).getAuthTag().toString('hex')
        };
    }

    /**
     * Desencripta datos previamente encriptados
     */
    public static decryptData(
        encryptedData: string,
        iv: string,
        authTag: string
    ): string {
        const decipher = crypto.createDecipheriv(
            this.ALGORITHM,
            Buffer.from(this.ENCRYPTION_KEY),
            Buffer.from(iv, 'hex')
        );

        (decipher as any).setAuthTag(Buffer.from(authTag, 'hex'));

        let decryptedData = decipher.update(encryptedData, 'hex', 'utf8');
        decryptedData += decipher.final('utf8');

        return decryptedData;
    }
}

export { };