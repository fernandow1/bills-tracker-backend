/* eslint-disable @typescript-eslint/naming-convention */
import { BcryptPasswordHasher } from '@infrastructure/security/bcrypt-password-hasher';
import { UserDataSourceImpl } from '@infrastructure/datasource/user/user.datasource.impl';
import { UserRepositoryImpl } from '@infrastructure/repositories/user/user.repository.impl';
import { UserController } from '@presentation/user/controller';
import { Router } from 'express';

export const UserRouter = {
  routes(): Router {
    const router = Router();

    const userDataSource = new UserDataSourceImpl();

    const userRepository = new UserRepositoryImpl(userDataSource);

    const userController = new UserController(userRepository, new BcryptPasswordHasher());

    router.post('/', (req, res) => {
      userController.createUser(req, res);
    });

    return router;
  },
};
