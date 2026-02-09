/* eslint-disable @typescript-eslint/naming-convention */
import { Router, Request, Response, NextFunction } from 'express';
import { DataSource } from 'typeorm';
import { AuthController } from './controller';
import { authRateLimiter, strictRateLimiter } from '@infrastructure/security/rate-limit.config';

export const AuthRouter = {
  routes(dataSource: DataSource): Router {
    const router = Router();
    const authController = new AuthController(dataSource);

    // POST /auth/login - Login de usuario
    // Rate limiter: 10 intentos por 15 minutos (solo cuenta intentos fallidos)
    router.post('/login', authRateLimiter, (req: Request, res: Response, next: NextFunction) => {
      authController.login(req, res, next);
    });

    // POST /auth/refresh - Refrescar access token
    // Rate limiter estricto: 3 intentos por hora
    router.post(
      '/refresh',
      strictRateLimiter,
      (req: Request, res: Response, next: NextFunction) => {
        authController.refreshToken(req, res, next);
      },
    );

    // POST /auth/revoke - Revocar refresh token
    // Rate limiter estricto: 3 intentos por hora
    router.post('/revoke', strictRateLimiter, (req: Request, res: Response, next: NextFunction) => {
      authController.revokeToken(req, res, next);
    });

    return router;
  },
};
