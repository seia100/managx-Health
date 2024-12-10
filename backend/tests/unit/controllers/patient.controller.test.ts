// tests/unit/controllers/patient.controller.test.ts
import { PatientController } from '@/controllers/patient.controller';
import { PatientService } from '@/services/patient.service';
import { Request, Response } from 'express';
import { faker } from '@faker-js/faker';

jest.mock('@/services/patient.service');

describe('PatientController', () => {
    let patientController: PatientController;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    const mockPatientService = PatientService as jest.Mocked<typeof PatientService>;

    beforeEach(() => {
        patientController = new PatientController();
        mockRequest = {
            body: {},
            params: {},
            query: {}
        };
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    describe('create', () => {
        it('should create a patient successfully', async () => {
            // Generar datos de prueba aleatorios
            const mockPatientData = {
                nombre: faker.person.fullName(),
                fecha_nacimiento: faker.date.past(),
                direccion: faker.location.streetAddress(),
                telefono: faker.phone.number(),
                email: faker.internet.email(),
                tipo_sangre: 'O+',
                alergias: [faker.science.chemicalElement().name]
            };

            mockRequest.body = mockPatientData;

            const mockCreatedPatient = {
                id: faker.string.uuid(),
                ...mockPatientData,
                created_at: new Date(),
                updated_at: new Date()
            };

            mockPatientService.prototype.create.mockResolvedValue(mockCreatedPatient);

            await patientController.create(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: true,
                data: mockCreatedPatient,
                message: 'Paciente creado exitosamente'
            });
        });
    });
});