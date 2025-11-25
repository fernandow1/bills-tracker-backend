import { GetUser } from './get-user';
import { UserRepository } from '../../../domain/repository/user.repository';
import {
  USERMOCK,
  userRepositoryDomainMock,
} from '../../../infrastructure/datasource/user/user.mock';

describe('GetUser', () => {
  let getUserUseCase: GetUser;
  let mockUserRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockUserRepository = userRepositoryDomainMock();
    getUserUseCase = new GetUser(mockUserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return user when found', async () => {
      // Arrange
      const userId = 1;
      mockUserRepository.findById.mockResolvedValue(USERMOCK);

      // Act
      const result = await getUserUseCase.execute(userId);

      // Assert
      expect(mockUserRepository.findById).toHaveBeenCalledTimes(1);
      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
      expect(result).toEqual(USERMOCK);
    });

    it('should return null when user not found', async () => {
      // Arrange
      const userId = 999;
      mockUserRepository.findById.mockResolvedValue(null);

      // Act
      const result = await getUserUseCase.execute(userId);

      // Assert
      expect(mockUserRepository.findById).toHaveBeenCalledTimes(1);
      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
      expect(result).toBeNull();
    });

    it('should propagate error from repository', async () => {
      // Arrange
      const userId = 1;
      const error = new Error('Database error');
      mockUserRepository.findById.mockRejectedValue(error);

      // Act & Assert
      await expect(getUserUseCase.execute(userId)).rejects.toThrow('Database error');
      expect(mockUserRepository.findById).toHaveBeenCalledTimes(1);
      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
    });

    it('should handle invalid userId', async () => {
      // Arrange
      const invalidUserId = -1;
      mockUserRepository.findById.mockResolvedValue(null);

      // Act
      const result = await getUserUseCase.execute(invalidUserId);

      // Assert
      expect(mockUserRepository.findById).toHaveBeenCalledTimes(1);
      expect(mockUserRepository.findById).toHaveBeenCalledWith(invalidUserId);
      expect(result).toBeNull();
    });
  });
});
