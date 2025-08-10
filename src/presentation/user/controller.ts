import { CreateUserDto } from '@domain/dtos/user/create-user.dto';
import { UserRepository } from '@domain/repository/user.repository';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response } from 'express';

export class UserController {
  constructor(private readonly repository: UserRepository) {}

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

    this.repository
      .create(dto)
      .then((user) => {
        res.status(201).json(user);
      })
      .catch((error) => {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      });
  };
}
