import { User, Session } from '@accounts/types';

export type ResumeSessionValidator = (user: User, session: Session) => Promise<any>;
