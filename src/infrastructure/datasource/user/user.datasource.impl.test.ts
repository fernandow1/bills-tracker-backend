import { UserDataSourceImpl } from './user.datasource.impl';
import { DataSource, Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';
import { dataSourceUserMock, userRepositoryMock, USERMOCK } from './user.mock';

describe('UserDataSourceImpl', () => {
  let userDataSource: UserDataSourceImpl;
  let mockDataSource: jest.Mocked<DataSource>;
  let mockUserRepository: jest.Mocked<Repository<User>>;

  beforeEach(() => {
    // Use centralized mocks
    mockUserRepository = userRepositoryMock();
    mockDataSource = dataSourceUserMock(mockUserRepository);
    userDataSource = new UserDataSourceImpl(mockDataSource);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUsers', () => {
    it('should return array of users', async () => {
      // Arrange
      const expectedUsers = [USERMOCK];
      (mockUserRepository.find as jest.Mock).mockResolvedValue(expectedUsers);

      // Act
      const result = await userDataSource.getUsers();

      // Assert
      expect(result).toEqual(expectedUsers);
      expect(mockDataSource.getRepository).toHaveBeenCalledWith(User);
      expect(mockUserRepository.find).toHaveBeenCalled();
    });

    it('should handle empty results', async () => {
      // Arrange
      (mockUserRepository.find as jest.Mock).mockResolvedValue([]);

      // Act
      const result = await userDataSource.getUsers();

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('createUser', () => {
    it('should create and return user', async () => {
      // Arrange
      const userData = {
        username: 'newuser',
        email: 'new@example.com',
        name: 'New',
        password: 'password',
      };
      (mockUserRepository.save as jest.Mock).mockResolvedValue(USERMOCK);

      // Act
      const result = await userDataSource.createUser(userData);

      // Assert
      expect(result).toEqual(USERMOCK);
      expect(mockDataSource.getRepository).toHaveBeenCalledWith(User);
      expect(mockUserRepository.save).toHaveBeenCalledWith(userData);
    });
  });

  describe('getUserById', () => {
    it('should return user when found', async () => {
      // Arrange
      (mockUserRepository.findOneBy as jest.Mock).mockResolvedValue(USERMOCK);

      // Act
      const result = await userDataSource.getUserById(1);

      // Assert
      expect(result).toEqual(USERMOCK);
      expect(mockDataSource.getRepository).toHaveBeenCalledWith(User);
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should return null when user not found', async () => {
      // Arrange
      (mockUserRepository.findOneBy as jest.Mock).mockResolvedValue(null);

      // Act
      const result = await userDataSource.getUserById(999);

      // Assert
      expect(result).toBeNull();
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id: 999 });
    });
  });

  describe('getUserByUsername', () => {
    it('should return user when found by username', async () => {
      // Arrange
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(USERMOCK),
      };
      (mockUserRepository.createQueryBuilder as jest.Mock).mockReturnValue(mockQueryBuilder);

      // Act
      const result = await userDataSource.getUserByUsername('testuser');

      // Assert
      expect(result).toEqual(USERMOCK);
      expect(mockDataSource.getRepository).toHaveBeenCalledWith(User);
      expect(mockUserRepository.createQueryBuilder).toHaveBeenCalledWith('user');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('user.username = :username', {
        username: 'testuser',
      });
      expect(mockQueryBuilder.select).toHaveBeenCalledWith([
        'user.id',
        'user.username',
        'user.password',
        'user.email',
        'user.name',
        'user.surname',
      ]);
      expect(mockQueryBuilder.getOne).toHaveBeenCalled();
    });

    it('should return null when user not found by username', async () => {
      // Arrange
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      };
      (mockUserRepository.createQueryBuilder as jest.Mock).mockReturnValue(mockQueryBuilder);

      // Act
      const result = await userDataSource.getUserByUsername('nonexistent');

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('updateUser', () => {
    it('should update and return user when found', async () => {
      // Arrange
      const userData = { name: 'Updated Name' };
      const updatedUser = { ...USERMOCK, ...userData };

      (mockUserRepository.findOneBy as jest.Mock).mockResolvedValue(USERMOCK);
      (mockUserRepository.save as jest.Mock).mockResolvedValue(updatedUser);

      // Act
      const result = await userDataSource.updateUser(1, userData);

      // Assert
      expect(result).toEqual(updatedUser);
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(mockUserRepository.save).toHaveBeenCalledWith({ id: 1, ...userData });
    });

    it('should throw error when user not found', async () => {
      // Arrange
      (mockUserRepository.findOneBy as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(userDataSource.updateUser(999, { name: 'New Name' })).rejects.toThrow(
        'User not found',
      );
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id: 999 });
    });
  });

  describe('deleteUser', () => {
    it('should soft delete user when found', async () => {
      // Arrange
      (mockUserRepository.findOneBy as jest.Mock).mockResolvedValue(USERMOCK);
      (mockUserRepository.softDelete as jest.Mock).mockResolvedValue(undefined);

      // Act
      await userDataSource.deleteUser(1);

      // Assert
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(mockUserRepository.softDelete).toHaveBeenCalledWith(1);
    });

    it('should throw error when user not found', async () => {
      // Arrange
      (mockUserRepository.findOneBy as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(userDataSource.deleteUser(999)).rejects.toThrow('User not found');
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id: 999 });
      expect(mockUserRepository.softDelete).not.toHaveBeenCalled();
    });
  });
});
