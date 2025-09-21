import { User } from '@domain/entities/user.entity';

export interface GetUserUseCase {
  execute(userId: number): Promise<User | null>;
}

export class GetUser {
  constructor(
    private readonly userRepository: { findById: (userId: number) => Promise<User | null> },
  ) {
    this.userRepository = userRepository;
  }

  async execute(userId: number): Promise<User | null> {
    return this.userRepository.findById(userId);
  }
}
