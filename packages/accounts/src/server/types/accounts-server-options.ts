import * as jwt from 'jsonwebtoken';
import { User, DatabaseInterface } from '../../types';
import { EmailTemplatesType } from './email-templates-type';
import { UserObjectSanitizerFunction } from './user-object-sanitizer-function';
import { ResumeSessionValidator } from './resume-session-validator';
import { PrepareMailFunction } from './prepare-mail-function';
import { SendMailType, SendSMSType } from './send-mail-type';

export interface AccountsServerOptions {
  /**
   * Return ambiguous error messages from login failures to prevent user enumeration. Defaults to true.
   */
  ambiguousErrorMessages?: boolean;
  db?: DatabaseInterface;
  tokenSecret: string;
  tokenConfigs?: {
    accessToken?: jwt.SignOptions;
    refreshToken?: jwt.SignOptions;
  };
  emailTemplates?: EmailTemplatesType;
  userObjectSanitizer?: UserObjectSanitizerFunction;
  impersonationAuthorize?: (user: User, impersonateToUser: User) => Promise<any>;
  resumeSessionValidator?: ResumeSessionValidator;
  siteUrl?: string;
  prepareMail?: PrepareMailFunction;
  sendMail?: SendMailType;
  sendSMS?: SendSMSType;
}
