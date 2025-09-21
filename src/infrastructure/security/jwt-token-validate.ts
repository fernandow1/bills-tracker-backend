import jwt, { JwtPayload } from 'jsonwebtoken';
import { ValidateToken } from '@domain/ports/validate-token';

export class JwtTokenValidate implements ValidateToken {
  validate(token: string): Promise<JwtPayload> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded as JwtPayload);
        }
      });
    });
  }
}
