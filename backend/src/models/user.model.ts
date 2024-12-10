// src/models/user.model.ts
import { Model } from './base.model';
import { BaseModel } from './types';
import { UserRole } from '@/types';
import { hashPassword } from '@/utils/encryption';

export interface User extends BaseModel {
    nombre: string;
    email: string;
    password_hash: string;
    rol: UserRole;
    ultimo_acceso: Date;
    activo: boolean;
    intentos_fallidos: number;
}

export class UserModel extends Model<User> {
    constructor() {
        super('usuarios');
    }

    public async findByEmail(email: string): Promise<User | null> {
        const query = `
            SELECT * FROM ${this.tableName}
            WHERE email = $1
        `;

        const result = await this.executeQuery<User>(query, [email]);
        return result.rows[0] || null;
    }

    public async create(data: Partial<User>): Promise<User> {

        if (data.password_hash) {
            data.password_hash = await hashPassword(data.password_hash);
        }
        return super.create(data);
    }

    public async updateLastAccess(id: string): Promise<void> {
        const query = `
            UPDATE ${this.tableName}
            SET ultimo_acceso = CURRENT_TIMESTAMP
            WHERE id = $1
        `;

        await this.executeQuery(query, [id]);
    }

    public async incrementFailedAttempts(id: string): Promise<void> {
        const query = `
            UPDATE ${this.tableName}
            SET intentos_fallidos = intentos_fallidos + 1
            WHERE id = $1
        `;

        await this.executeQuery(query, [id]);
    }
}