import { LoginUser } from './login-user';
import { UserRepository } from '../../../domain/repository/user.repository';
import { PasswordHasher } from '../../../domain/ports/password-hasher';
import { AuthUser } from './types/auth-user.type';
import {
  USERMOCK,
  userRepositoryDomainMock,
  passwordHasherMock,
} from '../../../infrastructure/datasource/user/user.mock';

// Mock JwtTokenGenerator
jest.mock('../../../infrastructure/security/jwt-token-generator', () => ({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  JwtTokenGenerator: jest.fn().mockImplementation(() => ({
    generate: jest.fn().mockResolvedValue('mocked_jwt_token'),
  })),
}));

// Mock JwtRefreshToken
jest.mock('../../../infrastructure/security/jwt-refresh-token', () => ({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  JwtRefreshToken: jest.fn().mockImplementation(() => ({
    generateRefreshToken: jest.fn().mockResolvedValue('mocked_refresh_token'),
  })),
}));

describe('LoginUser', () => {
  let loginUserUseCase: LoginUser;
  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockPasswordHasher: jest.Mocked<PasswordHasher>;

  beforeEach(() => {
    mockUserRepository = userRepositoryDomainMock();
    mockPasswordHasher = passwordHasherMock();
    loginUserUseCase = new LoginUser(mockUserRepository, mockPasswordHasher);
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should login user successfully with valid credentials', async () => {
      // Arrange
      const username = 'testuser';
      const password = 'plainPassword';
      const hashedPassword = 'hashed_plainPassword';
      const userWithHashedPassword = { ...USERMOCK, password: hashedPassword };

      mockUserRepository.findByUsername.mockResolvedValue(userWithHashedPassword);
      mockPasswordHasher.compare.mockResolvedValue(true);

      // Act
      const result = await loginUserUseCase.execute(username, password);

      // Assert
      expect(mockUserRepository.findByUsername).toHaveBeenCalledTimes(1);
      expect(mockUserRepository.findByUsername).toHaveBeenCalledWith(username);
      expect(mockPasswordHasher.compare).toHaveBeenCalledTimes(1);
      expect(mockPasswordHasher.compare).toHaveBeenCalledWith(password, hashedPassword);

      expect(result).toEqual({
        user: {
          id: USERMOCK.id,
          name: USERMOCK.name,
          surname: USERMOCK.surname,
          username: USERMOCK.username,
          email: USERMOCK.email,
        },
        token: 'mocked_jwt_token',
        refreshToken: 'mocked_refresh_token',
        expiresIn: 900, // 15 minutos en segundos
      } as AuthUser);
    });

    it('should throw error when user not found', async () => {
      // Arrange
      const username = 'nonexistentuser';
      const password = 'password';

      mockUserRepository.findByUsername.mockResolvedValue(null);

      // Act & Assert
      await expect(loginUserUseCase.execute(username, password)).rejects.toThrow(
        'Invalid username or password',
      );

      expect(mockUserRepository.findByUsername).toHaveBeenCalledTimes(1);
      expect(mockUserRepository.findByUsername).toHaveBeenCalledWith(username);
      expect(mockPasswordHasher.compare).not.toHaveBeenCalled();
    });

    it('should throw error when password is invalid', async () => {
      // Arrange
      const username = 'testuser';
      const password = 'wrongPassword';
      const hashedPassword = 'hashed_correctPassword';
      const userWithHashedPassword = { ...USERMOCK, password: hashedPassword };

      mockUserRepository.findByUsername.mockResolvedValue(userWithHashedPassword);
      mockPasswordHasher.compare.mockResolvedValue(false);

      // Act & Assert
      await expect(loginUserUseCase.execute(username, password)).rejects.toThrow(
        'Invalid username or password',
      );

      expect(mockUserRepository.findByUsername).toHaveBeenCalledTimes(1);
      expect(mockPasswordHasher.compare).toHaveBeenCalledTimes(1);
      expect(mockPasswordHasher.compare).toHaveBeenCalledWith(password, hashedPassword);
    });

    it('should propagate error from repository', async () => {
      // Arrange
      const username = 'testuser';
      const password = 'password';
      const error = new Error('Database error');

      mockUserRepository.findByUsername.mockRejectedValue(error);

      // Act & Assert
      await expect(loginUserUseCase.execute(username, password)).rejects.toThrow('Database error');

      expect(mockUserRepository.findByUsername).toHaveBeenCalledTimes(1);
      expect(mockPasswordHasher.compare).not.toHaveBeenCalled();
    });

    it('should propagate error from password hasher', async () => {
      // Arrange
      const username = 'testuser';
      const password = 'password';
      const hashedPassword = 'hashed_password';
      const userWithHashedPassword = { ...USERMOCK, password: hashedPassword };
      const error = new Error('Hashing comparison failed');

      mockUserRepository.findByUsername.mockResolvedValue(userWithHashedPassword);
      mockPasswordHasher.compare.mockRejectedValue(error);

      // Act & Assert
      await expect(loginUserUseCase.execute(username, password)).rejects.toThrow(
        'Hashing comparison failed',
      );

      expect(mockUserRepository.findByUsername).toHaveBeenCalledTimes(1);
      expect(mockPasswordHasher.compare).toHaveBeenCalledTimes(1);
    });

    it('should handle empty username', async () => {
      // Arrange
      const username = '';
      const password = 'password';

      mockUserRepository.findByUsername.mockResolvedValue(null);

      // Act & Assert
      await expect(loginUserUseCase.execute(username, password)).rejects.toThrow(
        'Invalid username or password',
      );

      expect(mockUserRepository.findByUsername).toHaveBeenCalledWith('');
    });

    it('should handle empty password', async () => {
      // Arrange
      const username = 'testuser';
      const password = '';
      const hashedPassword = 'hashed_realpassword';
      const userWithHashedPassword = { ...USERMOCK, password: hashedPassword };

      mockUserRepository.findByUsername.mockResolvedValue(userWithHashedPassword);
      mockPasswordHasher.compare.mockResolvedValue(false);

      // Act & Assert
      await expect(loginUserUseCase.execute(username, password)).rejects.toThrow(
        'Invalid username or password',
      );

      expect(mockPasswordHasher.compare).toHaveBeenCalledWith('', hashedPassword);
    });
  });
});
