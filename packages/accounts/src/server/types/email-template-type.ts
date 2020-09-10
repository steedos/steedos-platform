import { User } from '@accounts/types';

export interface EmailTemplateType {
  from?: string;
  subject: (user: User, token: string) => string;
  text: (user: User, url: string, token: string) => string;
  html?: (user: User, url: string, token: string) => string;
}
