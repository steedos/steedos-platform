import { User } from '@accounts/types';
import { EmailTemplatesType } from '../types/email-templates-type';

export const emailTemplates: EmailTemplatesType = {
  from: 'accounts-js <no-reply@accounts-js.com>',

  verificationCode: {
    subject: (user, code) => 'Verify code: ${code}',
    text: (user: User, url: string, code) =>
      `To verify your account email please please enter the code: ${code}`,
    html: (user: User, url: string, code) =>
      `To verify your account email please please enter the code: ${code}.`,
  },

  verifyEmail: {
    subject: () => 'Verify your account email',
    text: (user: User, url: string) =>
      `To verify your account email please click on this link: ${url}`,
    html: (user: User, url: string) =>
      `To verify your account email please <a href="${url}">click here</a>.`,
  },

  resetPassword: {
    subject: () => 'Reset your password',
    text: (user: User, url: string) => `To reset your password please click on this link: ${url}`,
    html: (user: User, url: string) =>
      `To reset your password please <a href="${url}">click here</a>.`,
  },

  enrollAccount: {
    subject: () => 'Set your password',
    text: (user: User, url: string) => `To set your password please click on this link: ${url}`,
    html: (user: User, url: string) =>
      `To set your password please <a href="${url}">click here</a>.`,
  },

  passwordChanged: {
    subject: () => 'Your password has been changed',
    text: () => `Your account password has been successfully changed`,
    html: () => `Your account password has been successfully changed.`,
  },
};

export type SendMailType = (mail: object) => Promise<void>;

export const sendMail = async (mail: object): Promise<void> => {
  // tslint:disable-next-line no-console
  console.warn('No configuration for email, you must set an email configuration');
  // tslint:disable-next-line no-console
  console.log(mail);
};
