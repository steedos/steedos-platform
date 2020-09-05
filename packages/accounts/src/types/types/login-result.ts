import { Tokens } from './tokens';

export interface LoginResult {
  sessionId: string;
  tokens: Tokens;
}
