import { GenerateToken } from '@domain/ports/generate-token';
import { RefreshToken } from '@domain/ports/refresh-token';
import { AppError } from '@application/errors/app-error';
import { RefreshTokenResponse } from '@application/uses-cases/auth/types/auth-user.type';

export class RefreshTokenUseCase {
  constructor(
    private readonly generateToken: GenerateToken,
    private readonly refreshToken: RefreshToken,
  ) {}

  async execute(refreshToken: string): Promise<RefreshTokenResponse> {
    try {
      // 1. Validar el refresh token
      const decoded = await this.refreshToken.validateRefreshToken(refreshToken);

      // 2. Extraer información del usuario del token
      const decodedPayload = decoded as { sub?: string; username?: string; email?: string };
      const { sub, username, email } = decodedPayload;

      if (!sub) {
        throw AppError.forbidden('Invalid refresh token: missing user ID');
      }

      // 3. Crear payload para el nuevo access token (sin campos JWT internos)
      const accessTokenPayload = {
        sub,
        username,
        email,
      };

      // 4. Generar nuevo access token (corta duración)
      const newAccessToken = await this.generateToken.generate(accessTokenPayload, '15m');

      if (!newAccessToken) {
        throw AppError.internalError('Failed to generate access token');
      }

      // 5. Generar nuevo refresh token (opcional: rotar refresh tokens para mayor seguridad)
      const newRefreshToken = await this.refreshToken.generateRefreshToken(accessTokenPayload);

      // 6. Opcional: Revocar el refresh token anterior (rotation)
      try {
        await this.refreshToken.revokeRefreshToken(refreshToken);
      } catch (error) {
        // Log del error pero no fallar el proceso
        console.warn('Failed to revoke old refresh token:', error);
      }

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        expiresIn: 15 * 60, // 15 minutos en segundos
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      // Manejar errores de JWT
      if (error instanceof Error) {
        if (error.message.includes('expired')) {
          throw AppError.unauthorized('Refresh token has expired');
        }
        if (error.message.includes('invalid')) {
          throw AppError.forbidden('Invalid refresh token');
        }
        if (error.message.includes('revoked')) {
          throw AppError.forbidden('Refresh token has been revoked');
        }
      }

      throw AppError.internalError('Failed to refresh token');
    }
  }
}
