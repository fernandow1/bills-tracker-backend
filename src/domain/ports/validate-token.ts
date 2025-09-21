export interface ValidateToken {
  validate(token: string): Promise<unknown>;
}
