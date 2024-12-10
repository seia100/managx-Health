// tests/helpers/auth.ts
import jwt from 'jsonwebtoken';
import { faker } from '@faker-js/faker';

export async function createTestToken(rol: string): Promise<string> {
    const testUser = {
        id: faker.string.uuid(),
        email: `test_${faker.internet.email()}`,
        rol
    };

    return jwt.sign(
        testUser,
        process.env.JWT_SECRET || 'test_secret',
        { expiresIn: '1h' }
    );
}