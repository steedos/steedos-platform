/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { AsyncOptionalCreatable } from '@salesforce/kit';
import { ensure, Nullable, Optional } from '@salesforce/ts-types';
import * as crypto from 'crypto';
import * as os from 'os';
import { join as pathJoin } from 'path';
import { retrieveKeychain } from './keyChain';
import { KeyChain } from './keyChainImpl';
import { Logger } from '../util/logger';
import { Messages } from '../util/messages';
import { SecureBuffer } from './secureBuffer';
import { SfdxError } from '../util/sfdxError';

const TAG_DELIMITER = ':';
const BYTE_COUNT_FOR_IV = 6;
const _algo = 'aes-256-gcm';

const KEY_NAME = 'sfdx';
const ACCOUNT = 'local';

Messages.importMessagesDirectory(pathJoin(__dirname));

interface CredType {
  username: string;
  password: string;
}

/**
 * osxKeyChain promise wrapper.
 */
const keychainPromises = {
  /**
   * Gets a password item.
   * @param service The keychain service name.
   * @param account The keychain account name.
   */
  getPassword(_keychain: KeyChain, service: string, account: string): Promise<CredType> {
    return new Promise((resolve, reject) =>
      _keychain.getPassword({ service, account }, (err: Nullable<Error>, password?: string) => {
        if (err) return reject(err);
        return resolve({ username: account, password: ensure(password) });
      })
    );
  },

  /**
   * Sets a generic password item in OSX keychain.
   * @param service The keychain service name.
   * @param account The keychain account name.
   * @param password The password for the keychain item.
   */
  setPassword(_keychain: KeyChain, service: string, account: string, password: string): Promise<CredType> {
    return new Promise((resolve, reject) =>
      _keychain.setPassword({ service, account, password }, (err: Nullable<Error>) => {
        if (err) return reject(err);
        return resolve({ username: account, password });
      })
    );
  }
};

interface CryptoOptions {
  keychain?: KeyChain;
  platform?: string;
  retryStatus?: string;
  noResetOnClose?: boolean;
}

/**
 * Class for managing encrypting and decrypting private auth information.
 */
export class Crypto extends AsyncOptionalCreatable<CryptoOptions> {
  private _key: SecureBuffer<string> = new SecureBuffer();

  private options: CryptoOptions;

  // Initialized in init
  private messages!: Messages;
  private noResetOnClose!: boolean;

  /**
   * Constructor
   * **Do not directly construct instances of this class -- use {@link Crypto.create} instead.**
   * @param options The options for the class instance.
   * @ignore
   */
  public constructor(options?: CryptoOptions) {
    super(options);
    this.options = options || {};
  }

  /**
   * Encrypts text. Returns the encrypted string or undefined if no string was passed.
   * @param text The text to encrypt.
   */
  public encrypt(text?: string): Optional<string> {
    if (text == null) {
      return;
    }

    if (this._key == null) {
      const errMsg = this.messages.getMessage('KeychainPasswordCreationError');
      throw new SfdxError(errMsg, 'KeychainPasswordCreationError');
    }

    const iv = crypto.randomBytes(BYTE_COUNT_FOR_IV).toString('hex');

    return this._key.value(
      (buffer: Buffer): string => {
        const cipher = crypto.createCipheriv(_algo, buffer.toString('utf8'), iv);

        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        const tag = cipher.getAuthTag().toString('hex');
        return `${iv}${encrypted}${TAG_DELIMITER}${tag}`;
      }
    );
  }

  /**
   * Decrypts text.
   * @param text The text to decrypt.
   */
  public decrypt(text?: string): Optional<string> {
    if (text == null) {
      return;
    }

    const tokens = text.split(TAG_DELIMITER);

    if (tokens.length !== 2) {
      const errMsg = this.messages.getMessage('InvalidEncryptedFormatError');
      const actionMsg = this.messages.getMessage('InvalidEncryptedFormatErrorAction');
      throw new SfdxError(errMsg, 'InvalidEncryptedFormatError', [actionMsg]);
    }

    const tag = tokens[1];
    const iv = tokens[0].substring(0, BYTE_COUNT_FOR_IV * 2);
    const secret = tokens[0].substring(BYTE_COUNT_FOR_IV * 2, tokens[0].length);

    return this._key.value((buffer: Buffer) => {
      const decipher = crypto.createDecipheriv(_algo, buffer.toString('utf8'), iv);

      let dec;
      try {
        decipher.setAuthTag(Buffer.from(tag, 'hex'));
        dec = decipher.update(secret, 'hex', 'utf8');
        dec += decipher.final('utf8');
      } catch (e) {
        const errMsg = this.messages.getMessage('AuthDecryptError', [e.message]);
        throw new SfdxError(errMsg, 'AuthDecryptError');
      }
      return dec;
    });
  }

  /**
   * Clears the crypto state. This should be called in a finally block.
   */
  public close(): void {
    if (!this.noResetOnClose) {
      this._key.clear();
    }
  }

  /**
   * Initialize async components.
   */
  protected async init(): Promise<void> {
    const logger = await Logger.child('crypto');

    if (!this.options.platform) {
      this.options.platform = os.platform();
    }

    logger.debug(`retryStatus: ${this.options.retryStatus}`);

    this.messages = Messages.loadMessages('@salesforce/core', 'encryption');

    this.noResetOnClose = !!this.options.noResetOnClose;

    try {
      this._key.consume(
        Buffer.from(
          (await keychainPromises.getPassword(await this.getKeyChain(this.options.platform), KEY_NAME, ACCOUNT))
            .password,
          'utf8'
        )
      );
    } catch (err) {
      // No password found
      if (err.name === 'PasswordNotFoundError') {
        // If we already tried to create a new key then bail.
        if (this.options.retryStatus === 'KEY_SET') {
          logger.debug('a key was set but the retry to get the password failed.');
          throw err;
        } else {
          logger.debug('password not found in keychain attempting to created one and re-init.');
        }

        const key = crypto.randomBytes(Math.ceil(16)).toString('hex');
        // Create a new password in the KeyChain.
        await keychainPromises.setPassword(ensure(this.options.keychain), KEY_NAME, ACCOUNT, key);

        return this.init();
      } else {
        throw err;
      }
    }
  }

  private async getKeyChain(platform: string) {
    if (!this.options.keychain) {
      this.options.keychain = await retrieveKeychain(platform);
    }
    return this.options.keychain;
  }
}
