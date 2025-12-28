import jwt, { JwtPayload } from 'jsonwebtoken';
import { RefreshToken } from '@domain/ports/refresh-token';
import { envs } from '@infrastructure/config/env';
import { randomBytes } from 'crypto';

export class JwtRefreshToken implements RefreshToken {
  // TODO: Implementar revocación de tokens con Redis

  async generateRefreshToken(payload: unknown): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!payload || typeof payload !== 'object') {
        reject(new Error('Invalid payload type'));
        return;
      }

      // Filtrar iss y aud del payload si existen (se pasarán como opciones)
      const { iss, aud, ...cleanPayload } = payload as Record<string, unknown>;

      // Añadir un jti (JWT ID) único para poder revocar tokens específicos
      const tokenPayload = {
        ...cleanPayload,
        type: 'refresh',
        jti: randomBytes(16).toString('hex'), // JSON Token Identifier único
      };

      jwt.sign(
        tokenPayload,
        envs.JWT_SECRET,
        {
          expiresIn: '7d', // Refresh tokens duran más tiempo
          issuer: 'bills-tracker-api',
          audience: 'bills-tracker-client',
        },
        (err, token) => {
          if (err) {
            reject(err);
          } else {
            resolve(token as string);
          }
        },
      );
    });
  }

  async validateRefreshToken(token: string): Promise<JwtPayload> {
    return new Promise((resolve, reject) => {
      // TODO: Verificar revocación con Redis
      // if (this.revokedTokens.has(token)) {
      //   reject(new Error('Token has been revoked'));
      //   return;
      // }

      jwt.verify(token, envs.JWT_SECRET, (err, decoded) => {
        if (err) {
          // Proporcionar mensaje más claro sobre el tipo de error
          if (err.message.includes('expired')) {
            reject(new Error('Refresh token has expired'));
          } else if (err.message.includes('invalid')) {
            reject(new Error('Invalid refresh token format'));
          } else {
            reject(err);
          }
          return;
        }

        const payload = decoded as JwtPayload;

        // Verificar que es un refresh token
        if (payload.type !== 'refresh') {
          reject(
            new Error(
              'Invalid token type: expected refresh token but received access token. Use the refresh token provided during login.',
            ),
          );
          return;
        }

        // Verificar issuer y audience
        if (payload.iss !== 'bills-tracker-api' || payload.aud !== 'bills-tracker-client') {
          reject(new Error('Invalid token issuer or audience'));
          return;
        }

        resolve(payload);
      });
    });
  }

  async revokeRefreshToken(token: string): Promise<void> {
    // TODO: Implementar revocación con Redis
    // Por ahora, los tokens solo se invalidan por expiración natural
    console.log('⚠️  Token revocation not implemented (requires Redis)');
    return Promise.resolve();
  }

  // TODO: Método auxiliar para limpiar tokens expirados (con Redis)
  // cleanupRevokedTokens(): void { ... }
}
