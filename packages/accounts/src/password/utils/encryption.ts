import * as bcrypt from 'bcryptjs';
import { createHash } from 'crypto';
import { PasswordType } from '../types/password-type';

export const bcryptPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

export const hashPassword = (password: PasswordType, algorithm: string) => {
  if (typeof password === 'string') {
    const hash = createHash(algorithm);
    hash.update(password);
    return hash.digest('hex');
  }

  return password.digest;
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> =>
  bcrypt.compare(password, hash);
