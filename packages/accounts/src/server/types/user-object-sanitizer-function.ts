import { User } from '@accounts/types';

export type UserObjectSanitizerFunction = (
  userObject: User,
  omitFunction: (userDoc: object, fields: string[]) => User,
  pickFunction: (userDoc: object, fields: string[]) => User
) => any;
