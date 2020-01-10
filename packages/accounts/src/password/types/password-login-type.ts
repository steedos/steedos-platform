import { LoginUserIdentity } from '@accounts/types';
import { PasswordType } from './password-type';

export interface PasswordLoginType {
  user: string | LoginUserIdentity;
  password: PasswordType;
  // 2FA code
  code?: string;
}
