import { CreateUser } from '@accounts/types';
import { PasswordType } from './password-type';

export interface PasswordCreateUserType extends CreateUser {
  password: PasswordType;
  mobile?: string;
}
