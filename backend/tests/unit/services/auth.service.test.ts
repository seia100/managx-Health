// tests/unit/services/auth.service.test.ts
import { AuthService } from '@/services/auth.service';
import { UserModel } from '@/models/user.model';
import { faker } from '@faker-js/faker';

// Mock del modelo de usuario
jest.mock('@/models/user.model');

describe('AuthService', () => {
    let authService: AuthService;
    const mockUserModel = UserModel as jest.Mocked<typeof UserModel>;

    beforeEach(() => {
        authService = new AuthService();
        jest.clearAllMocks();
    });

    describe('register', () => {
        it('should create a new user successfully', async () => {
            // Preparar datos de prueba aleatorios
            const mockUserData = {
                nombre: faker.person.fullName(),
                email: faker.internet.email(),
                password: faker.internet.password(),
                rol: 'MEDICO'
            };

            const mockCreatedUser = {
                id: faker.string.uuid(),
                ...mockUserData,
                created_at: new Date(),
                updated_at: new Date()
            };

            // Configurar el comportamiento del mock
            mockUserModel.prototype.findByEmail.mockResolvedValue(null);
            mockUserModel.prototype.create.mockResolvedValue(mockCreatedUser);

            // Ejecutar la prueba
            const result = await authService.register(mockUserData);

            // Verificar resultados
            expect(result).toEqual(mockCreatedUser);
            expect(mockUserModel.prototype.findByEmail).toHaveBeenCalledWith(mockUserData.email);
            expect(mockUserModel.prototype.create).toHaveBeenCalled();
        });
    });
});