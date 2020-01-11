import { ErrorMessages } from './types';

export const errors: ErrorMessages = {
  userNotFound: 'User not found',
  noPasswordSet: 'User has no password set',
  noEmailSet: 'User has no email set',
  incorrectPassword: 'Incorrect password',
  unrecognizedOptionsForLogin: 'Unrecognized options for login request',
  matchFailed: 'Match failed',
  invalidUsername: 'Invalid username',
  invalidEmail: 'Invalid email',
  invalidPassword: 'Invalid password',
  invalidNewPassword: 'Invalid new password',
  invalidToken: 'Invalid token',
  invalidCredentials: 'accounts.invalid_credentials',
  verifyEmailLinkExpired: 'Verify email link expired',
  verifyEmailLinkUnknownAddress: 'Verify email link is for unknown address',
  resetPasswordLinkExpired: 'Reset password link expired',
  resetPasswordLinkUnknownAddress: 'Reset password link is for unknown address',
  usernameAlreadyExists: 'Username already exists',
  emailAlreadyExists: 'Email already exists',
  usernameOrEmailRequired: 'Username or Email is required',
  emailRequired: 'Email is required'
};
