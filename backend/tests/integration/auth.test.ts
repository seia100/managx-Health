
// tests/integration/auth.test.ts
import request from 'supertest';
import app from '../src/app';
import { db } from '../src/config/database';
import { faker } from '@faker-js/faker';

describe('Auth Integration Tests', () => {
    beforeEach(async () => {
        // Limpiar datos de prueba
        await db.getPool().query('DELETE FROM usuarios WHERE email LIKE \'%test%\'');
    });

    describe('POST /api/auth/register', () => {
        it('should register a new user', async () => {
            const userData = {
                nombre: faker.person.fullName(),
                email: `test_${faker.internet.email()}`,
                password: faker.internet.password(),
                rol: 'MEDICO'
            };

            const response = await request(app)
                .post('/api/auth/register')
                .send(userData)
                .expect(201);

            expect(response.body.success).toBeTruthy();
            expect(response.body.data.email).toBe(userData.email);
        });
    });
});
