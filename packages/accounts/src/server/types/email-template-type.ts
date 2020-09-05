import { User } from '@accounts/types';

export interface EmailTemplateType {
  from?: string;
  subject: (user?: User) => string;
  text: (user: User, url: string) => string;
  html?: (user: User, url: string) => string;
}
