import jwt, { JwtPayload } from 'jsonwebtoken';
import { RefreshToken } from '@domain/ports/refresh-token';
import { envs } from '@infrastructure/config/env';
import { randomBytes } from 'crypto';

export class JwtRefreshToken implements RefreshToken {
  private revokedTokens: Set<string> = new Set(); // En producción esto debería estar en Redis o DB

  async generateRefreshToken(payload: unknown): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!payload || typeof payload !== 'object') {
        reject(new Error('Invalid payload type'));
        return;
      }

      // Añadir un jti (JWT ID) único para poder revocar tokens específicos
      const tokenPayload = {
        ...payload,
        type: 'refresh',
        jti: randomBytes(16).toString('hex'), // JSON Token Identifier único
      };

      jwt.sign(
        tokenPayload,
        envs.JWT_SECRET,
        {
          expiresIn: '7d', // Refresh tokens duran más tiempo
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
      // Verificar si el token está revocado
      if (this.revokedTokens.has(token)) {
        reject(new Error('Token has been revoked'));
        return;
      }

      jwt.verify(token, envs.JWT_SECRET, (err, decoded) => {
        if (err) {
          reject(err);
          return;
        }

        const payload = decoded as JwtPayload;

        // Verificar que es un refresh token
        if (payload.type !== 'refresh') {
          reject(new Error('Invalid token type'));
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
    try {
      // Validar que el token es válido antes de revocarlo
      await this.validateRefreshToken(token);
      this.revokedTokens.add(token);
    } catch {
      // Si el token ya es inválido, no hay nada que revocar
      throw new Error('Cannot revoke invalid token');
    }
  }

  // Método auxiliar para limpiar tokens expirados de la lista de revocados
  cleanupRevokedTokens(): void {
    const tokensToRemove: string[] = [];

    tokensToRemove.forEach((token) => {
      try {
        jwt.verify(token, envs.JWT_SECRET);
      } catch {
        // Si el token ya expiró, lo removemos de la lista
        tokensToRemove.push(token);
      }
    });

    tokensToRemove.forEach((token) => {
      this.revokedTokens.delete(token);
    });
  }
}
