// src/middleware/types.ts
import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
    user?: JwtPayload & {
        id: string;
        email: string;
        role: string;
        [key: string]: any;
    };
}