import bcrypt from 'bcryptjs';
import { PasswordHasher } from '@domain/ports/password-hasher';

export class BcryptPasswordHasher implements PasswordHasher {
  constructor(private readonly saltRounds = 10) {}

  hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }
  compare(password: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(password, hashed);
  }
}
