import { GenerateToken } from '@domain/ports/generate-token';
import { RefreshToken } from '@domain/ports/refresh-token';
import { createHttpError } from '@application/errors/http-error.interface';
import { RefreshTokenResponse } from '@application/uses-cases/auth/types/auth-user.type';

export class RefreshTokenUseCase {
  constructor(
    private readonly generateToken: GenerateToken,
    private readonly refreshToken: RefreshToken,
  ) {}

  async execute(refreshToken: string): Promise<RefreshTokenResponse> {
    console.log('🔄 Refreshing access token...');
    try {
      // 1. Validar el refresh token
      const decoded = await this.refreshToken.validateRefreshToken(refreshToken);

      // 2. Extraer información del usuario del token
      const decodedPayload = decoded as { sub?: string; username?: string; email?: string };
      const { sub, username, email } = decodedPayload;

      if (!sub) {
        throw createHttpError('Invalid refresh token: missing user ID', 403);
      }

      // 3. Crear payload para el nuevo access token (sin campos JWT internos)
      const accessTokenPayload = {
        sub,
        username,
        email,
      };

      // 4. Generar nuevo access token (corta duración)
      const newAccessToken = await this.generateToken.generate(accessTokenPayload, '1h');

      if (!newAccessToken) {
        throw createHttpError('Failed to generate access token', 500);
      }

      // 5. Generar nuevo refresh token
      const newRefreshToken = await this.refreshToken.generateRefreshToken(accessTokenPayload);

      // TODO: Implementar rotación de refresh tokens con Redis
      // Por ahora, el refresh token original sigue siendo válido hasta su expiración natural

      console.log('✅ Token refreshed successfully for user:', sub);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        expiresIn: 60 * 60, // 1 hora en segundos
      };
    } catch (error) {
      if (error instanceof Error && 'statusCode' in error) {
        throw error;
      }

      // Manejar errores de JWT
      if (error instanceof Error) {
        if (error.message.includes('expired')) {
          throw createHttpError('Refresh token has expired', 401);
        }
        if (error.message.includes('invalid')) {
          throw createHttpError('Invalid refresh token', 403);
        }
        if (error.message.includes('revoked')) {
          throw createHttpError('Refresh token has been revoked', 403);
        }
      }

      throw createHttpError('Failed to refresh token', 500);
    }
  }
}
