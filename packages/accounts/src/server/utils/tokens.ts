import * as jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';

const generateRandomDigit = function () {
  return Math.floor((Math.random() * 9) + 1);
};

/**
* Get random verification code
* @param length
* @returns {string}
*/
export const getRandomCode = function (length) {
  length = length || 4;
  let output = "";
  while (length-- > 0) {
      output += generateRandomDigit();
  }
  return output;
};


/**
 * Generate a random token string
 */
export const generateRandomToken = (length: number = 43): string =>
  randomBytes(length).toString('hex');

/**
 * Generate a random token string
 */
export const generateRandomCode = (length: number = 6): string => {
  length = length || 4;
  let output = "";
  while (length-- > 0) {
      output += generateRandomDigit();
  }
  return output;
}

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
