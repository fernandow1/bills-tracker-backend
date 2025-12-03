/* eslint-disable @typescript-eslint/naming-convention */
import { Router, Request, Response, NextFunction } from 'express';
import { DataSource } from 'typeorm';
import { AuthController } from './controller';

export const AuthRouter = {
  routes(dataSource: DataSource): Router {
    const router = Router();
    const authController = new AuthController(dataSource);

    // POST /auth/login - Login de usuario
    router.post('/login', (req: Request, res: Response, next: NextFunction) => {
      authController.login(req, res, next);
    });

    // POST /auth/refresh - Refrescar access token
    router.post('/refresh', (req: Request, res: Response, next: NextFunction) => {
      authController.refreshToken(req, res, next);
    });

    // POST /auth/revoke - Revocar refresh token
    router.post('/revoke', (req: Request, res: Response, next: NextFunction) => {
      authController.revokeToken(req, res, next);
    });

    return router;
  },
};
