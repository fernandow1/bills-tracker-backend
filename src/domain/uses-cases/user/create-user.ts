import { User } from '@domain/entities/user.entity';
import { UserRepository } from '@domain/repository/user.repository';

export interface CreateUserUseCase {
  execute(userData: Partial<User>): Promise<User>;
}

export class CreateUser {
  constructor(private userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(userData: Partial<User>): Promise<User> {
    const user = await this.userRepository.create(userData);
    return user;
  }
}
