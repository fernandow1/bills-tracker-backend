import { PasswordHasher } from '@domain/ports/password-hasher';
import { UserRepository } from '@domain/repository/user.repository';
import { JwtTokenGenerator } from '@infrastructure/security/jwt-token-generator';
import { AuthUser } from '@application/uses-cases/user/types/auth-user.type';
import { JwtPayload } from 'jsonwebtoken';

export interface LoginUserUseCase {
  execute(username: string, password: string): Promise<boolean>;
}

export class LoginUser {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
  ) {
    this.userRepository = userRepository;
    this.passwordHasher = passwordHasher;
  }

  async execute(username: string, password: string): Promise<AuthUser> {
    const user = await this.userRepository.findByUsername(username);

    if (!user) {
      throw new Error('User not found');
    }

    const isValid = await this.passwordHasher.compare(password, user.password);

    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    const tokenPayload: JwtPayload = {
      sub: String(user.id),
      iss: 'bills-tracker-api',
      username: user.username,
      email: user.email,
    };

    const token = await new JwtTokenGenerator().generate(tokenPayload, '1h');

    if (!token) {
      throw new Error('Failed to generate token');
    }

    return {
      name: user.name,
      surname: user.surname,
      token,
    } as AuthUser;
  }
}
