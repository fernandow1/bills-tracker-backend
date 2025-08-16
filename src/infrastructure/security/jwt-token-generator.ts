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
        jwt.sign(payload, jwtSecret, { expiresIn: duration } as jwt.SignOptions, (err, token) => {
          if (err) {
            reject(err);
          } else {
            resolve(token);
          }
        });
      } else {
        reject(new Error('Invalid payload type'));
      }
    });
  }
  validate(token: string): Promise<unknown> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded);
        }
      });
    });
  }
}
