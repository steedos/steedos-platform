import * as jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';

/**
 * Generate a random token string
 */
export const generateRandomToken = (length: number = 43): string =>
  randomBytes(length).toString('hex');

export const generateAccessToken = ({
  secret,
  data,
  config,
}: {
  secret: string;
  data?: any;
  config: jwt.SignOptions;
}) =>
  jwt.sign(
    {
      data,
    },
    secret,
    config
  );

export const generateRefreshToken = ({
  secret,
  data,
  config,
}: {
  secret: string;
  data?: any;
  config: jwt.SignOptions;
}) =>
  jwt.sign(
    {
      data,
    },
    secret,
    config
  );
