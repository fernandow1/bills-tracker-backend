import jwt, { JwtPayload } from 'jsonwebtoken';
import { ValidateToken } from '@domain/ports/validate-token';
import { envs } from '@infrastructure/config/env';

export class JwtTokenValidate implements ValidateToken {
  validate(token: string): Promise<JwtPayload> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, envs.JWT_SECRET, (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded as JwtPayload);
        }
      });
    });
  }
}
