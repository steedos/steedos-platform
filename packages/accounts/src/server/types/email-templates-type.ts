import { EmailTemplateType } from './email-template-type';

export interface EmailTemplatesType {
  from: string;
  verifyEmail: EmailTemplateType;
  resetPassword: EmailTemplateType;
  enrollAccount: EmailTemplateType;
  passwordChanged: EmailTemplateType;
}
