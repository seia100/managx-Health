// src/services/user.service.ts
import { UserModel, User } from '../models/user.model';
import { ValidationError, NotFoundError } from '../utils/errors';
import { logger } from '@/utils/logger';
import { UpdateUserDTO } from '@/dtos/user.dto';

export class UserService {
    private userModel: UserModel;

    constructor() {
        this.userModel = new UserModel();
    }

    /**
     * Encuentra un usuario por su ID
     * @throws NotFoundError si el usuario no existe
     */
    public async findById(id: string): Promise<User> {
        const user = await this.userModel.findById(id);
        if (!user) {
            throw new NotFoundError('Usuario no encontrado');
        }
        return user;
    }

    /**
     * Actualiza la información de un usuario
     * @throws NotFoundError si el usuario no existe
     * @throws ValidationError si hay problemas de validación
     */
    public async update(id: string, userData: UpdateUserDTO): Promise<User> {
        // Verificar existencia del usuario
        const user = await this.findById(id);

        // Verificar email único si se está actualizando
        if (userData.email && userData.email !== user.email) {
            const existingUser = await this.userModel.findByEmail(userData.email);
            if (existingUser) {
                throw new ValidationError('El email ya está en uso');
            }
        }

        const updatedUser = await this.userModel.update(id, userData);
        if (!updatedUser) {
            throw new NotFoundError('Error al actualizar usuario');
        }

        logger.info(`Usuario actualizado: ${id}`);
        return updatedUser;
    }

    /**
     * Elimina un usuario por su ID
     * @throws NotFoundError si el usuario no existe
     */
    public async delete(id: string): Promise<void> {
        const user = await this.findById(id);
        const deleted = await this.userModel.delete(id);
        if (!deleted) {
            throw new NotFoundError('Error al eliminar usuario');
        }
        logger.info(`Usuario eliminado: ${id}`);
    }
}