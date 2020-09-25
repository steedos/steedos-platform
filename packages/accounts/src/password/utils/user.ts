import { get } from 'lodash';
import { User, TokenRecord } from '@accounts/types';

export const getUserResetTokens = (user: User): TokenRecord[] => {
  return get(user, ['services', 'password', 'reset'], []);
};

export const getUserVerificationTokens = (user: User): TokenRecord[] => {
  return get(user, ['services', 'email', 'verificationTokens'], []);
};
