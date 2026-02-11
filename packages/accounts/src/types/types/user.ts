import { EmailRecord } from './email-record';

export interface User {
  username?: string;
  emails?: EmailRecord[];
  email: string;
  email_verified: boolean;
  mobile: string;
  mobile_verified: boolean;
  name: string;
  id: string;
  services?: object;
  deactivated: boolean;
  password_expired?: boolean;
  password_modified_at?: Date;
}
