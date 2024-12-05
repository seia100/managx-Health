// src/types/express/index.d.ts
import { UserRole } from '../../interfaces/user.interface';

declare global {
    namespace Express {
        export interface Request {
            user?: {
                id: string;
                email: string;
                rol: UserRole;
            };
        }
    }
}

// Esto es necesario para que TypeScript trate este archivo como un módulo
export {};