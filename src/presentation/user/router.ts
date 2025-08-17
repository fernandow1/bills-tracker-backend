/* eslint-disable @typescript-eslint/naming-convention */
import { BcryptPasswordHasher } from '@infrastructure/security/bcrypt-password-hasher';
import { UserDataSourceImpl } from '@infrastructure/datasource/user/user.datasource.impl';
import { UserRepositoryImpl } from '@infrastructure/repositories/user/user.repository.impl';
import { UserController } from '@presentation/user/controller';
import { Request, Router, Response, NextFunction } from 'express';

export const UserRouter = {
  routes(): Router {
    const router = Router();

    const userDataSource = new UserDataSourceImpl();

    const userRepository = new UserRepositoryImpl(userDataSource);

    const userController = new UserController(userRepository, new BcryptPasswordHasher());

    router.post('/', (req: Request, res: Response, next: NextFunction) => {
      userController.createUser(req, res, next);
    });

    router.post('/login', (req: Request, res: Response, next: NextFunction) => {
      userController.loginUser(req, res, next);
    });

    return router;
  },
};
