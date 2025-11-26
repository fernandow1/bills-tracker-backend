import { UserRepositoryImpl } from './user.repository.impl';
import { UserDataSource } from '../../../domain/datasources/user.datasource';
import { User } from '../../../domain/entities/user.entity';
import {
  USERMOCK,
  USERUPDATEMOCK,
  USERCREATEMOCK,
  userDataSourceDomainMock,
} from '../../datasource/user/user.mock';

describe('UserRepositoryImpl', () => {
  let mockDataSource: jest.Mocked<UserDataSource>;
  let repository: UserRepositoryImpl;

  beforeEach(() => {
    mockDataSource = userDataSourceDomainMock();
    repository = new UserRepositoryImpl(mockDataSource);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should delegate to datasource and return users', async () => {
      const mockUsers: User[] = [USERMOCK, USERMOCK];
      mockDataSource.getUsers.mockResolvedValue(mockUsers);

      const result = await repository.findAll();

      expect(mockDataSource.getUsers).toHaveBeenCalledTimes(1);
      expect(mockDataSource.getUsers).toHaveBeenCalledWith();
      expect(result).toEqual(mockUsers);
    });

    it('should propagate error from datasource', async () => {
      const error = new Error('Database error');
      mockDataSource.getUsers.mockRejectedValue(error);

      await expect(repository.findAll()).rejects.toThrow('Database error');
      expect(mockDataSource.getUsers).toHaveBeenCalledTimes(1);
    });
  });

  describe('findById', () => {
    it('should delegate to datasource and return user when found', async () => {
      const userId = 1;
      mockDataSource.getUserById.mockResolvedValue(USERMOCK);

      const result = await repository.findById(userId);

      expect(mockDataSource.getUserById).toHaveBeenCalledTimes(1);
      expect(mockDataSource.getUserById).toHaveBeenCalledWith(userId);
      expect(result).toEqual(USERMOCK);
    });

    it('should return null when user not found', async () => {
      const userId = 999;
      mockDataSource.getUserById.mockResolvedValue(null);

      const result = await repository.findById(userId);

      expect(mockDataSource.getUserById).toHaveBeenCalledTimes(1);
      expect(mockDataSource.getUserById).toHaveBeenCalledWith(userId);
      expect(result).toBeNull();
    });

    it('should propagate error from datasource', async () => {
      const error = new Error('Database error');
      mockDataSource.getUserById.mockRejectedValue(error);

      await expect(repository.findById(1)).rejects.toThrow('Database error');
    });
  });

  describe('findByUsername', () => {
    it('should delegate to datasource and return user when found', async () => {
      const username = 'testuser';
      mockDataSource.getUserByUsername.mockResolvedValue(USERMOCK);

      const result = await repository.findByUsername(username);

      expect(mockDataSource.getUserByUsername).toHaveBeenCalledTimes(1);
      expect(mockDataSource.getUserByUsername).toHaveBeenCalledWith(username);
      expect(result).toEqual(USERMOCK);
    });

    it('should return null when user not found', async () => {
      const username = 'notfound';
      mockDataSource.getUserByUsername.mockResolvedValue(null);

      const result = await repository.findByUsername(username);

      expect(mockDataSource.getUserByUsername).toHaveBeenCalledTimes(1);
      expect(mockDataSource.getUserByUsername).toHaveBeenCalledWith(username);
      expect(result).toBeNull();
    });

    it('should propagate error from datasource', async () => {
      const error = new Error('Database error');
      mockDataSource.getUserByUsername.mockRejectedValue(error);

      await expect(repository.findByUsername('testuser')).rejects.toThrow('Database error');
    });
  });

  describe('create', () => {
    it('should delegate to datasource and return created user', async () => {
      const userData = USERCREATEMOCK;
      mockDataSource.createUser.mockResolvedValue(USERMOCK);

      const result = await repository.create(userData);

      expect(mockDataSource.createUser).toHaveBeenCalledTimes(1);
      expect(mockDataSource.createUser).toHaveBeenCalledWith(userData);
      expect(result).toEqual(USERMOCK);
    });

    it('should propagate error from datasource', async () => {
      const error = new Error('Validation error');
      mockDataSource.createUser.mockRejectedValue(error);

      await expect(repository.create(USERCREATEMOCK)).rejects.toThrow('Validation error');
    });
  });

  describe('update', () => {
    it('should delegate to datasource and return updated user', async () => {
      const userId = 1;
      const userData = USERUPDATEMOCK;
      const updatedUser = { ...USERMOCK, ...userData };
      mockDataSource.updateUser.mockResolvedValue(updatedUser);

      const result = await repository.update(userId, userData);

      expect(mockDataSource.updateUser).toHaveBeenCalledTimes(1);
      expect(mockDataSource.updateUser).toHaveBeenCalledWith(userId, userData);
      expect(result).toEqual(updatedUser);
    });

    it('should return null when user not found', async () => {
      const userId = 999;
      const userData = USERUPDATEMOCK;
      mockDataSource.updateUser.mockRejectedValue(new Error('User not found'));

      await expect(repository.update(userId, userData)).rejects.toThrow('User not found');
    });

    it('should propagate error from datasource', async () => {
      const error = new Error('Update failed');
      mockDataSource.updateUser.mockRejectedValue(error);

      await expect(repository.update(1, USERUPDATEMOCK)).rejects.toThrow('Update failed');
    });
  });

  describe('delete', () => {
    it('should delegate to datasource for user deletion', async () => {
      const userId = 1;
      mockDataSource.deleteUser.mockResolvedValue();

      await repository.delete(userId);

      expect(mockDataSource.deleteUser).toHaveBeenCalledTimes(1);
      expect(mockDataSource.deleteUser).toHaveBeenCalledWith(userId);
    });

    it('should propagate error when user not found', async () => {
      const userId = 999;
      mockDataSource.deleteUser.mockRejectedValue(new Error('User not found'));

      await expect(repository.delete(userId)).rejects.toThrow('User not found');
    });

    it('should propagate error from datasource', async () => {
      const error = new Error('Delete failed');
      mockDataSource.deleteUser.mockRejectedValue(error);

      await expect(repository.delete(1)).rejects.toThrow('Delete failed');
    });
  });
});
