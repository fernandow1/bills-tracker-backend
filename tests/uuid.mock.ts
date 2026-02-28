import * as crypto from 'crypto';

export function v7(): string {
  const uuid = crypto.randomUUID();
  return uuid.substring(0, 14) + '7' + uuid.substring(15);
}

export default { v7 };
