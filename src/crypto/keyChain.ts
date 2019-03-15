/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { env } from '@salesforce/kit';
import { KeyChain, keyChainImpl } from './keyChainImpl';
import { Logger } from '../util/logger';
import { SfdxError } from '../util/sfdxError';

/**
 * Gets the os level keychain impl.
 * @param platform The os platform.
 * @ignore
 */
export const retrieveKeychain = async (platform: string): Promise<KeyChain> => {
  const logger: Logger = await Logger.child('keyChain');
  logger.debug(`platform: ${platform}`);

  const useGenericUnixKeychainVar = env.getBoolean('SFDX_USE_GENERIC_UNIX_KEYCHAIN');
  const shouldUseGenericUnixKeychain = !!useGenericUnixKeychainVar && useGenericUnixKeychainVar;

  if (/^win/.test(platform)) {
    return keyChainImpl.generic_windows;
  } else if (/darwin/.test(platform)) {
    // OSX can use the generic keychain. This is useful when running under an
    // automation user.
    if (shouldUseGenericUnixKeychain) {
      return keyChainImpl.generic_unix;
    } else {
      return keyChainImpl.darwin;
    }
  } else if (/linux/.test(platform)) {
    // Use the generic keychain if specified
    if (shouldUseGenericUnixKeychain) {
      return keyChainImpl.generic_unix;
    } else {
      // otherwise try and use the builtin keychain
      try {
        await keyChainImpl.linux.validateProgram();
        return keyChainImpl.linux;
      } catch (e) {
        // If the builtin keychain is not available use generic
        return keyChainImpl.generic_unix;
      }
    }
  } else {
    throw SfdxError.create('@salesforce/core', 'encryption', 'UnsupportedOperatingSystemError', [platform]);
  }
};
