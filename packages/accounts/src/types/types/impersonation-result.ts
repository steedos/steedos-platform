import { Tokens } from './tokens';
import { User } from './user';

export interface ImpersonationResult {
  authorized: boolean;
  tokens?: Tokens;
  user?: User;
}
