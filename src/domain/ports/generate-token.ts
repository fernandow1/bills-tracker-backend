export interface GenerateToken {
  generate(payload: unknown, duration: unknown): Promise<string | undefined>;
}
