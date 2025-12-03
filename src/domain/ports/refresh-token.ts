export interface RefreshToken {
  generateRefreshToken(payload: unknown): Promise<string>;
  validateRefreshToken(token: string): Promise<unknown>;
  revokeRefreshToken(token: string): Promise<void>;
}
