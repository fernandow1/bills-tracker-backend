import { UpdateUser } from './update-user';
import { UserRepository } from '../../../domain/repository/user.repository';
import { PasswordHasher } from '../../../domain/ports/password-hasher';
import { UpdateUserDto } from '../../../application/dtos/user/update-user.dto';
import {
  USERMOCK,
  ROLESMOCK,
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
      const updateData: UpdateUserDto = { id_role: ROLESMOCK.Admin.id };
      const existingUser = { ...USERMOCK, role: ROLESMOCK.Guest };
      const updatedUser = { ...USERMOCK, role: ROLESMOCK.Admin };

      mockUserRepository.findById.mockResolvedValue(existingUser);
      mockUserRepository.update.mockResolvedValue(updatedUser);

      // Act
      const result = await updateUserUseCase.execute(userId, updateData);

      // Assert
      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
      expect(mockUserRepository.update).toHaveBeenCalledWith(userId, {
        role: { id: ROLESMOCK.Admin.id },
      });
      expect(result.role.id).toBe(ROLESMOCK.Admin.id);
    });

    it('should update user role from User to Admin', async () => {
      // Arrange
      const userId = 1;
      const updateData: UpdateUserDto = { id_role: ROLESMOCK.Admin.id };
      const existingUser = { ...USERMOCK, role: ROLESMOCK.User };
      const updatedUser = { ...USERMOCK, role: ROLESMOCK.Admin };

      mockUserRepository.findById.mockResolvedValue(existingUser);
      mockUserRepository.update.mockResolvedValue(updatedUser);

      // Act
      const result = await updateUserUseCase.execute(userId, updateData);

      // Assert
      expect(result.role.id).toBe(ROLESMOCK.Admin.id);
    });

    it('should update user without changing role when not provided', async () => {
      // Arrange
      const userId = 1;
      const updateData: UpdateUserDto = { name: 'Updated Name' };
      const existingUser = { ...USERMOCK, role: ROLESMOCK.User };
      const updatedUser = { ...USERMOCK, name: 'Updated Name', role: ROLESMOCK.User };

      mockUserRepository.findById.mockResolvedValue(existingUser);
      mockUserRepository.update.mockResolvedValue(updatedUser);

      // Act
      const result = await updateUserUseCase.execute(userId, updateData);

      // Assert
      expect(mockUserRepository.update).toHaveBeenCalledWith(userId, updateData);
      expect(result.role.id).toBe(ROLESMOCK.User.id); // Role should remain unchanged
    });

    it('should update user with multiple fields including role', async () => {
      // Arrange
      const userId = 1;
      const updateData: UpdateUserDto = {
        name: 'New Name',
        email: 'newemail@example.com',
        id_role: ROLESMOCK.Admin.id,
      };
      const existingUser = { ...USERMOCK };
      const { id_role, ...otherData } = updateData;
      const updatedUser = { ...USERMOCK, ...otherData, role: ROLESMOCK.Admin };

      mockUserRepository.findById.mockResolvedValue(existingUser);
      mockUserRepository.update.mockResolvedValue(updatedUser);

      // Act
      const result = await updateUserUseCase.execute(userId, updateData);

      // Assert
      expect(result.name).toBe('New Name');
      expect(result.email).toBe('newemail@example.com');
      expect(result.role.id).toBe(ROLESMOCK.Admin.id);
    });

    it('should throw error when user not found', async () => {
      // Arrange
      const userId = 999;
      const updateData: UpdateUserDto = { id_role: ROLESMOCK.Admin.id };

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
        id_role: ROLESMOCK.User.id,
      };
      const existingUser = { ...USERMOCK, role: ROLESMOCK.Guest };
      const updatedUser = {
        ...USERMOCK,
        password: 'hashed_newpassword123',
        role: ROLESMOCK.User,
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
        role: { id: ROLESMOCK.User.id },
      });
      expect(result.role.id).toBe(ROLESMOCK.User.id);
    });
  });
});
