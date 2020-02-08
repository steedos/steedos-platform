import { ErrorMessages } from './types';

export const errors: ErrorMessages = {
  userNotFound: 'User not found',
  noPasswordSet: 'User has no password set',
  noEmailSet: 'User has no email set',
  incorrectPassword: 'accounts.incorrectPassword',
  unrecognizedOptionsForLogin: 'accounts.unrecognizedOptionsForLogin',
  matchFailed: 'accounts.matchFailed',
  invalidUsername: 'accounts.invalidUsername',
  invalidEmail: 'accounts.invalidEmail',
  invalidPassword: 'accounts.invalidPassword',
  invalidNewPassword: 'accounts.invalidNewPassword',
  invalidToken: 'accounts.invalidToken',
  invalidCredentials: 'accounts.invalid_credentials',
  verifyEmailLinkExpired: 'accounts.verifyEmailLinkExpired',
  verifyEmailLinkUnknownAddress: 'Verify email link is for unknown address',
  resetPasswordLinkExpired: 'accounts.resetPasswordLinkExpired',
  resetPasswordLinkUnknownAddress: 'Reset password link is for unknown address',
  usernameAlreadyExists: 'accounts.usernameAlreadyExists',
  emailAlreadyExists: 'accounts.emailAlreadyExists',
  usernameOrEmailRequired: 'accounts.usernameOrEmailRequired',
  emailRequired: 'accounts.emailRequired'
};
