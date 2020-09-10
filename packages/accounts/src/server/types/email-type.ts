import { EmailTemplateType } from './email-template-type';

export type EmailType = EmailTemplateType & { to: string };
