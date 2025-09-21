import { NextFunction, Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { JwtTokenValidate } from '@infrastructure/security/jwt-token-validate';
import { UserDataSourceImpl } from '@infrastructure/datasource/user/user.datasource.impl';
import { UserRepositoryImpl } from '@infrastructure/repositories/user/user.repository.impl';
import { GetUser } from '@application/uses-cases/user/get-user';
import { SafeUser } from '@application/uses-cases/user/types/auth-user.type';

export async function validateJwt(req: Request, res: Response, next: NextFunction): Promise<void> {
  const token = req.header('Authorization');

  if (!token) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }

  if (token.startsWith('Bearer ')) {
    const authorization = token.split(' ')[1];

    const jwtValidator = new JwtTokenValidate();

    try {
      const decoded: JwtPayload = await jwtValidator.validate(authorization);

      if (!decoded) {
        res.status(401).json({ error: 'Invalid token' });
        return;
      }

      const user = await new GetUser(new UserRepositoryImpl(new UserDataSourceImpl())).execute(
        Number(decoded.sub),
      );

      if (!user) {
        res.status(401).json({ error: 'User not found' });
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...safeUser } = user;

      req.user = safeUser as SafeUser;

      next();
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Failed to validate token' });
      return;
    }
  } else {
    res.status(401).json({ error: 'Unauthorized access' });
  }
}
