import { User } from '@domain/entities/user.entity';
import { PasswordHasher } from '@domain/ports/password-hasher';
import { UserRepository } from '@domain/repository/user.repository';

export interface CreateUserUseCase {
  execute(userData: Partial<User>): Promise<User>;
}

export class CreateUser {
  constructor(
    private userRepository: UserRepository,
    private passwordHasher: PasswordHasher,
  ) {
    this.userRepository = userRepository;
    this.passwordHasher = passwordHasher;
  }

  async execute(userData: Partial<User>): Promise<User> {
    if (userData.password) {
      userData.password = await this.passwordHasher.hash(userData.password);
    }
    const user = await this.userRepository.create(userData);
    return user;
  }
}
