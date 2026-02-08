import { UpdateUser } from './update-user';
import { UserRepository } from '../../../domain/repository/user.repository';
import { PasswordHasher } from '../../../domain/ports/password-hasher';
import { Role } from '../../../domain/enums/role.enum';
import { UpdateUserDto } from '../../../application/dtos/user/update-user.dto';
import {
  USERMOCK,
  userRepositoryDomainMock,
  passwordHasherMock,
} from '../../../infrastructure/datasource/user/user.mock';

describe('UpdateUser', () => {
  let updateUserUseCase: UpdateUser;
  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockPasswordHasher: jest.Mocked<PasswordHasher>;

  beforeEach(() => {
    mockUserRepository = userRepositoryDomainMock();
    mockPasswordHasher = passwordHasherMock();
    updateUserUseCase = new UpdateUser(mockUserRepository, mockPasswordHasher);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should update user with new role', async () => {
      // Arrange
      const userId = 1;
      const updateData: UpdateUserDto = { role: Role.Admin };
      const existingUser = { ...USERMOCK, role: Role.Guest };
      const updatedUser = { ...USERMOCK, role: Role.Admin };

      mockUserRepository.findById.mockResolvedValue(existingUser);
      mockUserRepository.update.mockResolvedValue(updatedUser);

      // Act
      const result = await updateUserUseCase.execute(userId, updateData);

      // Assert
      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
      expect(mockUserRepository.update).toHaveBeenCalledWith(userId, updateData);
      expect(result.role).toBe(Role.Admin);
    });

    it('should update user role from User to Admin', async () => {
      // Arrange
      const userId = 1;
      const updateData: UpdateUserDto = { role: Role.Admin };
      const existingUser = { ...USERMOCK, role: Role.User };
      const updatedUser = { ...USERMOCK, role: Role.Admin };

      mockUserRepository.findById.mockResolvedValue(existingUser);
      mockUserRepository.update.mockResolvedValue(updatedUser);

      // Act
      const result = await updateUserUseCase.execute(userId, updateData);

      // Assert
      expect(result.role).toBe(Role.Admin);
    });

    it('should update user without changing role when not provided', async () => {
      // Arrange
      const userId = 1;
      const updateData: UpdateUserDto = { name: 'Updated Name' };
      const existingUser = { ...USERMOCK, role: Role.User };
      const updatedUser = { ...USERMOCK, name: 'Updated Name', role: Role.User };

      mockUserRepository.findById.mockResolvedValue(existingUser);
      mockUserRepository.update.mockResolvedValue(updatedUser);

      // Act
      const result = await updateUserUseCase.execute(userId, updateData);

      // Assert
      expect(mockUserRepository.update).toHaveBeenCalledWith(userId, updateData);
      expect(result.role).toBe(Role.User); // Role should remain unchanged
    });

    it('should update user with multiple fields including role', async () => {
      // Arrange
      const userId = 1;
      const updateData: UpdateUserDto = {
        name: 'New Name',
        email: 'newemail@example.com',
        role: Role.Admin,
      };
      const existingUser = { ...USERMOCK };
      const updatedUser = { ...USERMOCK, ...updateData };

      mockUserRepository.findById.mockResolvedValue(existingUser);
      mockUserRepository.update.mockResolvedValue(updatedUser);

      // Act
      const result = await updateUserUseCase.execute(userId, updateData);

      // Assert
      expect(result.name).toBe('New Name');
      expect(result.email).toBe('newemail@example.com');
      expect(result.role).toBe(Role.Admin);
    });

    it('should throw error when user not found', async () => {
      // Arrange
      const userId = 999;
      const updateData: UpdateUserDto = { role: Role.Admin };

      mockUserRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(updateUserUseCase.execute(userId, updateData)).rejects.toThrow('User not found');
      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
      expect(mockUserRepository.update).not.toHaveBeenCalled();
    });

    it('should update user with password and role', async () => {
      // Arrange
      const userId = 1;
      const updateData: UpdateUserDto = {
        password: 'newpassword123',
        role: Role.User,
      };
      const existingUser = { ...USERMOCK, role: Role.Guest };
      const updatedUser = {
        ...USERMOCK,
        password: 'hashed_newpassword123',
        role: Role.User,
      };

      mockUserRepository.findById.mockResolvedValue(existingUser);
      mockPasswordHasher.hash.mockResolvedValue('hashed_newpassword123');
      mockUserRepository.update.mockResolvedValue(updatedUser);

      // Act
      const result = await updateUserUseCase.execute(userId, updateData);

      // Assert
      expect(mockPasswordHasher.hash).toHaveBeenCalledWith('newpassword123');
      expect(mockUserRepository.update).toHaveBeenCalledWith(userId, {
        password: 'hashed_newpassword123',
        role: Role.User,
      });
      expect(result.role).toBe(Role.User);
    });
  });
});
