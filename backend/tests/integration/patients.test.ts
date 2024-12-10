// tests/integration/patients.test.ts
import request from 'supertest';
import app from '../../src/app';
import { db } from '../../src/config/database';
import { faker } from '@faker-js/faker';
import { createTestToken } from '@/helpers/auth';

describe('Patients Integration Tests', () => {
    let authToken: string;

    beforeAll(async () => {
        // Crear usuario de prueba y obtener token
        authToken = await createTestToken('MEDICO');
    });

    beforeEach(async () => {
        // Limpiar datos de prueba
        await db.getPool().query('DELETE FROM pacientes WHERE email LIKE \'%test%\'');
    });

    describe('POST /api/patients', () => {
        it('should create a new patient', async () => {
            const patientData = {
                nombre: faker.person.fullName(),
                fecha_nacimiento: faker.date.past().toISOString().split('T')[0],
                direccion: faker.location.streetAddress(),
                telefono: faker.phone.number(),
                email: `test_${faker.internet.email()}`,
                tipo_sangre: 'O+',
                alergias: [faker.science.chemicalElement().name]
            };

            const response = await request(app)
                .post('/api/patients')
                .set('Authorization', `Bearer ${authToken}`)
                .send(patientData)
                .expect(201);

            expect(response.body.success).toBeTruthy();
            expect(response.body.data.email).toBe(patientData.email);
        });
    });
});