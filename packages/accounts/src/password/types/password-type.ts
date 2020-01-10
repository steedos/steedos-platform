import { HashAlgorithm } from '@accounts/types';

export type PasswordType =
  | string
  | {
      digest: string;
      algorithm: HashAlgorithm;
    };
