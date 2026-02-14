import { PasswordHasher } from '@domain/ports/password-hasher';
import { UserRepository } from '@domain/repository/user.repository';
import { JwtTokenGenerator } from '@infrastructure/security/jwt-token-generator';
import { JwtRefreshToken } from '@infrastructure/security/jwt-refresh-token';
import { AuthUser } from '@application/uses-cases/auth/types/auth-user.type';
import { createHttpError } from '@application/errors/http-error.interface';
import { JwtPayload } from 'jsonwebtoken';

export interface LoginUserUseCase {
  execute(username: string, password: string): Promise<boolean>;
}

export class LoginUser {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
  ) {
    this.userRepository = userRepository;
    this.passwordHasher = passwordHasher;
  }

  async execute(username: string, password: string): Promise<AuthUser> {
    const user = await this.userRepository.findByUsername(username);

    if (!user) {
      throw createHttpError('Invalid username or password', 401);
    }

    const isValid = await this.passwordHasher.compare(password, user.password);

    if (!isValid) {
      throw createHttpError('Invalid username or password', 401);
    }

    const tokenPayload: JwtPayload = {
      sub: String(user.id),
      username: user.username,
      email: user.email,
      role: user.role,
    };

    // Generar access token (corta duración)
    const accessToken = await new JwtTokenGenerator().generate(tokenPayload, '1h');

    // Generar refresh token (larga duración)
    const refreshTokenGenerator = new JwtRefreshToken();
    const refreshToken = await refreshTokenGenerator.generateRefreshToken(tokenPayload);

    if (!accessToken || !refreshToken) {
      throw new Error('Failed to generate tokens');
    }

    return {
      user: {
        id: user.id,
        name: user.name,
        surname: user.surname,
        username: user.username,
        email: user.email,
      },
      token: accessToken,
      refreshToken,
      expiresIn: 60 * 60, // 1 hora en segundos
    } as AuthUser;
  }
}
