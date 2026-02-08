import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { User } from '../../database/entities/user.entity';
import { UserDataSource } from '../../../domain/datasources/user.datasource';
import { UserRepository } from '../../../domain/repository/user.repository';
import { PasswordHasher } from '../../../domain/ports/password-hasher';
import { JwtTokenGenerator } from '../../security/jwt-token-generator';
import { faker } from '@faker-js/faker';
import { Role } from '../../../domain/enums/role.enum';

export function dataSourceUserMock(
  repository: jest.Mocked<Repository<User>>,
): jest.Mocked<DataSource> {
  return {
    getRepository: jest.fn().mockImplementation((entity) => {
      if (!entity) throw new Error('Entity not provided');
      return repository;
    }),
  } as unknown as jest.Mocked<DataSource>;
}

export function userRepositoryMock(): jest.Mocked<Repository<User>> {
  const mockQueryBuilder = {
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orWhere: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue([USERMOCK, USERMOCK]),
    getOne: jest.fn().mockResolvedValue(USERMOCK),
  } as unknown as jest.Mocked<SelectQueryBuilder<User>>;

  return {
    find: jest.fn().mockResolvedValue([USERMOCK, USERMOCK, USERMOCK]),
    save: jest.fn().mockImplementation(async (userData: Partial<User>): Promise<User> => {
      return {
        id: userData.id ? userData.id : faker.datatype.number({ min: 1, max: 1000 }),
        username: userData.username ? userData.username : faker.internet.userName(),
        email: userData.email ? userData.email : faker.internet.email(),
        name: userData.name ? userData.name : faker.datatype.string(),
        surname: userData.surname ? userData.surname : faker.datatype.string(),
        password: userData.password ? userData.password : faker.internet.password(),
        role: userData.role ? userData.role : Role.Guest,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        ownedBills: [],
        createdBills: [],
      } as User;
    }),
    findOneBy: jest.fn().mockImplementation(async (criteria): Promise<User | null> => {
      if (
        criteria.id === 999 ||
        criteria.username === 'notfound' ||
        criteria.email === 'notfound@example.com'
      ) {
        return null;
      }
      return {
        id: criteria.id || faker.datatype.number({ min: 1, max: 1000 }),
        username: criteria.username || faker.internet.userName(),
        email: criteria.email || faker.internet.email(),
        name: faker.datatype.string(),
        surname: faker.datatype.string(),
        password: faker.internet.password(),
        role: Role.Guest,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        ownedBills: [],
        createdBills: [],
      } as User;
    }),
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
    softDelete: jest.fn().mockImplementation(async (criteria) => {
      if (criteria.id === 999) {
        throw new Error('User not found');
      }
      return { affected: 1 };
    }),
    merge: jest.fn().mockImplementation((existingUser: User, userData: Partial<User>) => {
      // TypeORM merge() modifica el objeto existingUser in-place
      Object.assign(existingUser, userData);
      return existingUser;
    }),
    findAndCount: jest.fn().mockResolvedValue([[USERMOCK, USERMOCK], 2]),
  } as unknown as jest.Mocked<Repository<User>>;
}

export const USERMOCK: User = {
  id: 1,
  username: 'testuser',
  email: 'test@example.com',
  name: 'Test',
  surname: 'User',
  password: 'hashedpassword',
  role: Role.Guest,
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date('2023-01-01'),
  deletedAt: null,
  ownedBills: [],
  createdBills: [],
};

export const USERUPDATEMOCK: Partial<User> = {
  name: 'Updated Name',
  surname: 'Updated Surname',
  email: 'updated@example.com',
};

export const USERCREATEMOCK: Omit<
  User,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'ownedBills' | 'createdBills'
> = {
  username: 'newuser',
  email: 'newuser@example.com',
  name: 'New',
  surname: 'User',
  password: 'newpassword123',
  role: Role.Guest,
};

export function userDataSourceDomainMock(): jest.Mocked<UserDataSource> {
  return {
    search: jest.fn().mockResolvedValue({
      data: [USERMOCK, USERMOCK],
      total: 2,
      page: 1,
      limit: 10,
    }),
    getUsers: jest.fn().mockResolvedValue([USERMOCK, USERMOCK]),
    createUser: jest.fn().mockResolvedValue(USERMOCK),
    getUserById: jest.fn().mockImplementation(async (id: number) => {
      return id === 999 ? null : USERMOCK;
    }),
    getUserByUsername: jest.fn().mockImplementation(async (username: string) => {
      return username === 'notfound' ? null : USERMOCK;
    }),
    updateUser: jest.fn().mockImplementation(async (id: number, userData: Partial<User>) => {
      if (id === 999) {
        throw new Error('User not found');
      }
      return { ...USERMOCK, ...userData };
    }),
    deleteUser: jest.fn().mockImplementation(async (id: number) => {
      if (id === 999) {
        throw new Error('User not found');
      }
      return Promise.resolve();
    }),
  } as jest.Mocked<UserDataSource>;
}

export function userRepositoryDomainMock(): jest.Mocked<UserRepository> {
  return {
    search: jest.fn().mockResolvedValue({
      data: [USERMOCK, USERMOCK],
      total: 2,
      page: 1,
      limit: 10,
    }),
    findAll: jest.fn().mockResolvedValue([USERMOCK, USERMOCK]),
    findById: jest.fn().mockImplementation(async (id: number) => {
      return id === 999 ? null : USERMOCK;
    }),
    findByUsername: jest.fn().mockImplementation(async (username: string) => {
      return username === 'notfound' ? null : USERMOCK;
    }),
    create: jest.fn().mockResolvedValue(USERMOCK),
    update: jest.fn().mockImplementation(async (id: number, userData: Partial<User>) => {
      if (id === 999) {
        return null;
      }
      return { ...USERMOCK, ...userData };
    }),
    delete: jest.fn().mockImplementation(async (id: number) => {
      if (id === 999) {
        throw new Error('User not found');
      }
      return Promise.resolve();
    }),
  } as jest.Mocked<UserRepository>;
}

export function passwordHasherMock(): jest.Mocked<PasswordHasher> {
  return {
    hash: jest.fn().mockImplementation(async (password: string) => {
      return `hashed_${password}`;
    }),
    compare: jest.fn().mockImplementation(async (password: string, hashedPassword: string) => {
      return hashedPassword === `hashed_${password}`;
    }),
  } as jest.Mocked<PasswordHasher>;
}

export function jwtTokenGeneratorMock(): jest.Mocked<JwtTokenGenerator> {
  return {
    generate: jest.fn().mockImplementation(async (payload, expiration) => {
      return `jwt_token_${payload.sub}_${expiration}`;
    }),
  } as jest.Mocked<JwtTokenGenerator>;
}

export const AUTHUSERMOCK = {
  name: 'Test',
  surname: 'User',
  token: 'mocked_jwt_token',
};

export const CREATEUSERDTOMOCK = {
  username: 'testuser',
  email: 'test@example.com',
  name: 'Test',
  surname: 'User',
  password: 'password123',
};

export const AUTHUSERDTOMOCK = {
  username: 'testuser',
  password: 'password123',
};
