import { NextFunction, Request, Response } from 'express';
import { CreateUserDto } from '@application/dtos/user/create-user.dto';
import { UpdateUserDto } from '@application/dtos/user/update-user.dto';
import { PasswordHasher } from '@domain/ports/password-hasher';
import { UserRepository } from '@domain/repository/user.repository';
import { CreateUser } from '@application/uses-cases/user/create-user';
import { UpdateUser } from '@application/uses-cases/user/update-user';
import { SearchUser } from '@application/uses-cases/user/search-user';
import { queryMapper } from '@application/mappers/query-filter.mapper';
import { QueryFilterDTO } from '@infrastructure/http/dto/query-filter.dto';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { AppError } from '@application/errors/app-error';
import { SafeUser } from '@application/uses-cases/user/types/auth-user.type';

export class UserController {
  constructor(
    private readonly repository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const dto = plainToClass(CreateUserDto, req.body);
    const validationErrors = await validate(dto, {
      whitelist: true,
      forbidNonWhitelisted: true,
      validationError: { target: false, value: false },
    });

    if (validationErrors.length) {
      return next(AppError.badRequest('Validation failed', validationErrors));
    }

    try {
      const createUser = new CreateUser(this.repository, this.passwordHasher);
      const user = await createUser.execute(dto);
      res.status(201).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Internal server error',
      });
    }
  };

  updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    const dto = plainToClass(UpdateUserDto, req.body);
    const validationErrors = await validate(dto, {
      whitelist: true,
      forbidNonWhitelisted: true,
      validationError: { target: false, value: false },
    });

    if (validationErrors.length) {
      return next(AppError.badRequest('Validation failed', validationErrors));
    }

    try {
      const updateUser = new UpdateUser(this.repository, this.passwordHasher);
      const user = await updateUser.execute(Number(id), dto);
      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        if (error.message === 'User not found') {
          return next(AppError.notFound('User not found'));
        }
        if (
          error.message === 'Email already in use' ||
          error.message === 'Username already in use'
        ) {
          return next(AppError.badRequest(error.message, []));
        }
      }
      res.status(500).json({
        message: 'Internal server error',
      });
    }
  };

  searchUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto = plainToClass(QueryFilterDTO, req.query);

      // Use SafeUser keys to generate allowed fields
      const safeUserFields: (keyof SafeUser)[] = [
        'id',
        'name',
        'email',
        'username',
        'role',
        'createdAt',
        'updatedAt',
        'deletedAt',
      ];

      const allowedFields = new Map(safeUserFields.map((field) => [field, {}]));
      const allowedOperations = new Set(['eq', 'like']);

      const filter = queryMapper(dto, { allowedFields, allowedOperations });
      const searchUser = new SearchUser(this.repository);
      const result = await searchUser.execute(filter);
      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Internal server error',
      });
    }
  };
}
