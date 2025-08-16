import { AuthUserDTO } from '@domain/dtos/user/auth-user.dto';
import { CreateUserDto } from '@domain/dtos/user/create-user.dto';
import { PasswordHasher } from '@domain/ports/password-hasher';
import { UserRepository } from '@domain/repository/user.repository';
import { CreateUser } from '@application/uses-cases/user/create-user';
import { LoginUser } from '@application/uses-cases/user/login-user';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response } from 'express';

export class UserController {
  constructor(
    private readonly repository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  createUser = async (req: Request, res: Response): Promise<void> => {
    const dto = plainToClass(CreateUserDto, req.body);
    const validationErrors = await validate(dto, {
      whitelist: true,
      forbidNonWhitelisted: true,
      validationError: { target: false, value: false },
    });

    if (validationErrors.length) {
      res.status(400).json({
        errors: validationErrors.map((error) => ({
          property: error.property,
          constraints: error.constraints,
        })),
      });
      return;
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

  loginUser = async (req: Request, res: Response): Promise<void> => {
    const dto = plainToClass(AuthUserDTO, req.body);

    const validationErrors = await validate(dto);

    if (validationErrors.length) {
      res.status(400).json({
        errors: validationErrors.map((error) => ({
          property: error.property,
          constraints: error.constraints,
        })),
      });
      return;
    }

    const { username, password } = req.body;
    try {
      const loginUser = new LoginUser(this.repository, this.passwordHasher);
      const authUser = await loginUser.execute(username, password);
      if (!authUser) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
      }
      res.status(200).json({ ...authUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Internal server error',
      });
    }
  };
}
