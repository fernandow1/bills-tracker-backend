import { UpdateUserDto } from '@application/dtos/user/update-user.dto';
import { User } from '@domain/entities/user.entity';
import { PasswordHasher } from '@domain/ports/password-hasher';
import { UserRepository } from '@domain/repository/user.repository';

export interface UpdateUserUseCase {
  execute(id: number, userData: UpdateUserDto): Promise<User>;
}

/**
 * Update User use case
 * Handles user updates including password hashing
 */
export class UpdateUser implements UpdateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute(id: number, userData: UpdateUserDto): Promise<User> {
    // Check if user exists
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new Error('User not found');
    }

    // If password is being updated, hash it
    const updateData: Partial<User> = { ...userData };
    if (userData.password) {
      updateData.password = await this.passwordHasher.hash(userData.password);
    }

    // If email is being updated, check it's not already in use by another user
    if (userData.email && userData.email !== existingUser.email) {
      const userWithEmail = await this.userRepository.findByUsername(userData.email);
      if (userWithEmail && userWithEmail.id !== id) {
        throw new Error('Email already in use');
      }
    }

    // If username is being updated, check it's not already in use by another user
    if (userData.username && userData.username !== existingUser.username) {
      const userWithUsername = await this.userRepository.findByUsername(userData.username);
      if (userWithUsername && userWithUsername.id !== id) {
        throw new Error('Username already in use');
      }
    }

    const updatedUser = await this.userRepository.update(id, updateData);
    if (!updatedUser) {
      throw new Error('Failed to update user');
    }

    return updatedUser;
  }
}
