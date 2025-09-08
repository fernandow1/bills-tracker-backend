import { NextFunction, Request, Response } from 'express';
import { AuthUserDTO } from '@application/dtos/user/auth-user.dto';
import { CreateUserDto } from '@application/dtos/user/create-user.dto';
import { PasswordHasher } from '@domain/ports/password-hasher';
import { UserRepository } from '@domain/repository/user.repository';
import { CreateUser } from '@application/uses-cases/user/create-user';
import { LoginUser } from '@application/uses-cases/user/login-user';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { AppError } from '@application/errors/app-error';

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

  loginUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const dto = plainToClass(AuthUserDTO, req.body);

    const validationErrors = await validate(dto);

    if (validationErrors.length) {
      return next(AppError.badRequest('Validation failed', validationErrors));
    }

    try {
      const { username, password } = req.body;
      const loginUser = new LoginUser(this.repository, this.passwordHasher);
      const authUser = await loginUser.execute(username, password);
      if (!authUser) {
        return next(AppError.forbidden('Invalid credentials'));
      }
      res.status(200).json({ ...authUser });
    } catch (error) {
      console.error(error);
      return next(AppError.internalError('Internal server error'));
    }
  };
}
