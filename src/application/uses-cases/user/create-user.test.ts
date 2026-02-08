import { CreateUser } from './create-user';
import { UserRepository } from '../../../domain/repository/user.repository';
import { PasswordHasher } from '../../../domain/ports/password-hasher';
import { Role } from '../../../domain/enums/role.enum';
import {
  USERMOCK,
  USERCREATEMOCK,
  userRepositoryDomainMock,
  passwordHasherMock,
} from '../../../infrastructure/datasource/user/user.mock';

describe('CreateUser', () => {
  let createUserUseCase: CreateUser;
  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockPasswordHasher: jest.Mocked<PasswordHasher>;

  beforeEach(() => {
    mockUserRepository = userRepositoryDomainMock();
    mockPasswordHasher = passwordHasherMock();
    createUserUseCase = new CreateUser(mockUserRepository, mockPasswordHasher);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should create user with hashed password', async () => {
      // Arrange
      const userData = { ...USERCREATEMOCK, password: 'plainPassword' };
      const expectedUser = { ...USERMOCK, password: 'hashed_plainPassword' };

      mockPasswordHasher.hash.mockResolvedValue('hashed_plainPassword');
      mockUserRepository.create.mockResolvedValue(expectedUser);

      // Act
      const result = await createUserUseCase.execute(userData);

      // Assert
      expect(mockPasswordHasher.hash).toHaveBeenCalledTimes(1);
      expect(mockPasswordHasher.hash).toHaveBeenCalledWith('plainPassword');
      expect(mockUserRepository.create).toHaveBeenCalledTimes(1);
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        ...userData,
        password: 'hashed_plainPassword',
      });
      expect(result).toEqual(expectedUser);
    });

    it('should create user without hashing when no password provided', async () => {
      // Arrange
      const userData = {
        username: USERCREATEMOCK.username,
        email: USERCREATEMOCK.email,
        name: USERCREATEMOCK.name,
        surname: USERCREATEMOCK.surname,
      };

      mockUserRepository.create.mockResolvedValue(USERMOCK); // Act
      const result = await createUserUseCase.execute(userData);

      // Assert
      expect(mockPasswordHasher.hash).not.toHaveBeenCalled();
      expect(mockUserRepository.create).toHaveBeenCalledTimes(1);
      expect(mockUserRepository.create).toHaveBeenCalledWith(userData);
      expect(result).toEqual(USERMOCK);
    });

    it('should create user with empty password without hashing', async () => {
      // Arrange
      const userData = { ...USERCREATEMOCK, password: '' };

      mockUserRepository.create.mockResolvedValue(USERMOCK);

      // Act
      const result = await createUserUseCase.execute(userData);

      // Assert
      expect(mockPasswordHasher.hash).not.toHaveBeenCalled();
      expect(mockUserRepository.create).toHaveBeenCalledTimes(1);
      expect(mockUserRepository.create).toHaveBeenCalledWith(userData);
      expect(result).toEqual(USERMOCK);
    });

    it('should propagate error from password hasher', async () => {
      // Arrange
      const userData = { ...USERCREATEMOCK, password: 'plainPassword' };
      const error = new Error('Hashing failed');

      mockPasswordHasher.hash.mockRejectedValue(error);

      // Act & Assert
      await expect(createUserUseCase.execute(userData)).rejects.toThrow('Hashing failed');
      expect(mockPasswordHasher.hash).toHaveBeenCalledTimes(1);
      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });

    it('should propagate error from repository', async () => {
      // Arrange
      const userData = { ...USERCREATEMOCK, password: 'plainPassword' };
      const error = new Error('Database error');

      mockPasswordHasher.hash.mockResolvedValue('hashed_plainPassword');
      mockUserRepository.create.mockRejectedValue(error);

      // Act & Assert
      await expect(createUserUseCase.execute(userData)).rejects.toThrow('Database error');
      expect(mockPasswordHasher.hash).toHaveBeenCalledTimes(1);
      expect(mockUserRepository.create).toHaveBeenCalledTimes(1);
    });

    it('should handle partial user data', async () => {
      // Arrange
      const userData = {
        username: 'partialuser',
        email: 'partial@example.com',
        password: 'password123',
      };
      const hashedPassword = 'hashed_password123';

      mockPasswordHasher.hash.mockResolvedValue(hashedPassword);
      mockUserRepository.create.mockResolvedValue(USERMOCK);

      // Act
      const result = await createUserUseCase.execute(userData);

      // Assert
      expect(mockPasswordHasher.hash).toHaveBeenCalledWith('password123');
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        ...userData,
        password: hashedPassword,
      });
      expect(result).toEqual(USERMOCK);
    });

    it('should create user with specific role when provided', async () => {
      // Arrange
      const userData = { ...USERCREATEMOCK, password: 'password123', role: Role.Admin };
      const expectedUser = { ...USERMOCK, password: 'hashed_password123', role: Role.Admin };

      mockPasswordHasher.hash.mockResolvedValue('hashed_password123');
      mockUserRepository.create.mockResolvedValue(expectedUser);

      // Act
      const result = await createUserUseCase.execute(userData);

      // Assert
      expect(mockPasswordHasher.hash).toHaveBeenCalledWith('password123');
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        ...userData,
        password: 'hashed_password123',
      });
      expect(result).toEqual(expectedUser);
      expect(result.role).toBe(Role.Admin);
    });

    it('should create user with User role when specified', async () => {
      // Arrange
      const userData = { ...USERCREATEMOCK, password: 'password123', role: Role.User };
      const expectedUser = { ...USERMOCK, password: 'hashed_password123', role: Role.User };

      mockPasswordHasher.hash.mockResolvedValue('hashed_password123');
      mockUserRepository.create.mockResolvedValue(expectedUser);

      // Act
      const result = await createUserUseCase.execute(userData);

      // Assert
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        ...userData,
        password: 'hashed_password123',
      });
      expect(result.role).toBe(Role.User);
    });

    it('should create user with Guest role when not specified', async () => {
      // Arrange
      const userData = { ...USERCREATEMOCK, password: 'password123' };
      // Remove role from userData to test default behavior
      delete (userData as any).role;
      const expectedUser = { ...USERMOCK, password: 'hashed_password123', role: Role.Guest };

      mockPasswordHasher.hash.mockResolvedValue('hashed_password123');
      mockUserRepository.create.mockResolvedValue(expectedUser);

      // Act
      const result = await createUserUseCase.execute(userData);

      // Assert
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        ...userData,
        password: 'hashed_password123',
      });
      // The default role should be Guest (set by the entity)
      expect(result.role).toBe(Role.Guest);
    });
  });
});
