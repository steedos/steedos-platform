import { Tokens } from './tokens';

export interface LoginResult {
  sessionId: string;
  token: string;
  tokens: Tokens;
  user: any;
}
