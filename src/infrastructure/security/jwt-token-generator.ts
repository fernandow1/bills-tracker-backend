import jwt from 'jsonwebtoken';
import { GenerateToken } from '@domain/ports/generate-token';
import { envs } from '@infrastructure/config/env';

export class JwtTokenGenerator implements GenerateToken {
  generate(payload: unknown, duration: unknown): Promise<string | undefined> {
    const jwtSecret = envs.JWT_SECRET;

    return new Promise((resolve, reject) => {
      if (
        payload &&
        typeof payload === 'object' &&
        typeof duration === 'string' &&
        /^\d+[smhd]$/.test(duration)
      ) {
        jwt.sign(
          payload,
          jwtSecret,
          {
            expiresIn: duration,
            issuer: 'bills-tracker-api',
            audience: 'bills-tracker-client',
          } as jwt.SignOptions,
          (err, token) => {
            if (err) {
              reject(err);
            } else {
              resolve(token);
            }
          },
        );
      } else {
        reject(new Error('Invalid payload type'));
      }
    });
  }
}
