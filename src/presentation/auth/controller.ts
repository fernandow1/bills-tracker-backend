import { Request, Response, NextFunction } from 'express';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { LoginDto } from '@application/dtos/auth/login.dto';
import { RefreshTokenDto } from '@application/dtos/auth/refresh-token.dto';
import { LoginUser } from '@application/uses-cases/auth/login-user';
import { RefreshTokenUseCase } from '@application/uses-cases/auth/refresh-token';
import { JwtTokenGenerator } from '@infrastructure/security/jwt-token-generator';
import { JwtRefreshToken } from '@infrastructure/security/jwt-refresh-token';
import { UserRepositoryImpl } from '@infrastructure/repositories/user/user.repository.impl';
import { UserDataSourceImpl } from '@infrastructure/datasource/user/user.datasource.impl';
import { BcryptPasswordHasher } from '@infrastructure/security/bcrypt-password-hasher';
import { AppError } from '@application/errors/app-error';
import { DataSource } from 'typeorm';

export class AuthController {
  constructor(private readonly dataSource: DataSource) {}

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validar DTO
      const loginDto = plainToClass(LoginDto, req.body);
      const errors = await validate(loginDto);

      if (errors.length > 0) {
        return next(AppError.badRequest('Validation failed', errors));
      }

      // Crear dependencias
      const userDatasource = new UserDataSourceImpl(this.dataSource);
      const userRepository = new UserRepositoryImpl(userDatasource);
      const passwordHasher = new BcryptPasswordHasher();

      // Ejecutar use case
      const loginUseCase = new LoginUser(userRepository, passwordHasher);
      const authUser = await loginUseCase.execute(loginDto.username, loginDto.password);

      res.status(200).json({ ...authUser });
    } catch (error) {
      console.error(error);
      // Si es un AppError (como unauthorized), pasarlo directamente
      if (error instanceof AppError) {
        return next(error);
      }
      return next(AppError.internalError('Internal server error'));
    }
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validar DTO
      const refreshTokenDto = plainToClass(RefreshTokenDto, req.body);
      const errors = await validate(refreshTokenDto);

      if (errors.length > 0) {
        return next(AppError.badRequest('Validation failed', errors));
      }

      // Crear dependencias
      const tokenGenerator = new JwtTokenGenerator();
      const refreshTokenService = new JwtRefreshToken();

      // Ejecutar use case
      const refreshTokenUseCase = new RefreshTokenUseCase(tokenGenerator, refreshTokenService);
      const result = await refreshTokenUseCase.execute(refreshTokenDto.refreshToken);

      res.status(200).json({
        message: 'Token refreshed successfully',
        ...result,
      });
    } catch (error) {
      console.error(error);
      if (error instanceof Error && error.message.includes('expired')) {
        return next(AppError.badRequest('Refresh token has expired', error));
      }
      if (error instanceof Error && error.message.includes('revoked')) {
        return next(AppError.badRequest('Refresh token has been revoked', error));
      }
      if (error instanceof Error && error.message.includes('Invalid refresh token')) {
        return next(AppError.forbidden('Invalid refresh token', error));
      }
      if (
        error instanceof Error &&
        (error.message.includes('jwt') || error.message.includes('token'))
      ) {
        return next(AppError.forbidden('Invalid or malformed token', error));
      }
      return next(AppError.internalError('Failed to refresh token'));
    }
  };

  revokeToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validar DTO
      const refreshTokenDto = plainToClass(RefreshTokenDto, req.body);
      const errors = await validate(refreshTokenDto);

      if (errors.length > 0) {
        return next(AppError.badRequest('Validation failed', errors));
      }

      // Revocar token
      const refreshTokenService = new JwtRefreshToken();
      await refreshTokenService.revokeRefreshToken(refreshTokenDto.refreshToken);

      res.status(200).json({
        message: 'Token revoked successfully',
      });
    } catch (error) {
      console.error(error);
      if (error instanceof Error && error.message.includes('Cannot revoke invalid token')) {
        return next(AppError.badRequest('Invalid refresh token', error));
      }
      if (
        error instanceof Error &&
        (error.message.includes('jwt') ||
          error.message.includes('token') ||
          error.message.includes('invalid'))
      ) {
        return next(AppError.badRequest('Invalid or malformed token', error));
      }
      return next(AppError.internalError('Failed to revoke token'));
    }
  };
}
