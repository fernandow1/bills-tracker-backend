import { User } from '@domain/entities/user.entity';

export type SafeUser = Omit<User, 'password' | 'ssn'>;

export type AuthUser = {
  user: SafeUser;
  token: string;
  refreshToken: string;
  expiresIn: number; // Tiempo de expiración del access token en segundos
};

// Tipo para la respuesta del refresh token
export type RefreshTokenResponse = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
};
