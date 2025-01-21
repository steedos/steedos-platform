/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { ensure, Optional } from '@salesforce/ts-types';
import * as crypto from 'crypto';

const cipherName = 'aes256';
const cipherSize = 32;

/**
 * Returns the intended type of the object to return. This is implementation specific.
 * @param buffer A buffer containing the decrypted secret.
 */
export type DecipherCallback<T> = (buffer: Buffer) => T;

/**
 * Used to store and retrieve a sensitive information in memory. This is not meant for at rest encryption.
 *
 * ```
 * const sString: SecureBuffer<string> = new SecureBuffer();
 * sString.consume(secretTextBuffer);
 * const value: string = sString.value((buffer: Buffer): string => {
 *     const password: string = buffer.toString('utf8');
 *     // doSomething with the password
 *     // returns something of type <T>
 *     return testReturnValue;
 * });
 * ```
 */
export class SecureBuffer<T> {
  private key = crypto.randomBytes(cipherSize);
  private iv = crypto.randomBytes(16);

  private secret?: Buffer;

  /**
   * Invokes a callback with a decrypted version of the buffer.
   * @param cb The callback containing the decrypted buffer parameter that returns a desired.
   * typed object. It's important to understand that once the callback goes out of scope the buffer parameters is
   * overwritten with random data. Do not make a copy of this buffer and persist it!
   */
  public value(cb: DecipherCallback<T>): Optional<T> {
    if (cb) {
      const cipher = crypto.createDecipheriv(cipherName, this.key, this.iv);
      const a: any = cipher.update(ensure(this.secret));
      const b: any = cipher.final();
      const c = Buffer.concat([a, b]);
      try {
        return cb(c);
      } finally {
        crypto.randomFillSync(a);
        crypto.randomFillSync(b);
        crypto.randomFillSync(c);
      }
    }
  }

  /**
   * Overwrites the value of the encrypted secret with random data.
   */
  public clear() {
    if (this.secret) {
      crypto.randomFillSync(this.secret);
    }
    const cipher = crypto.createCipheriv(cipherName, this.key, this.iv);
    this.secret = Buffer.concat([cipher.update(Buffer.from('')) as any, cipher.final()]);
  }

  /**
   * Consumes a buffer of data that's intended to be secret.
   * @param buffer Data to encrypt. The input buffer is overwritten with random data after it's encrypted
   * and assigned internally.
   */
  public consume(buffer: Buffer) {
    let targetBuffer = buffer;
    if (!targetBuffer) {
      targetBuffer = Buffer.from('');
    }
    const cipher = crypto.createCipheriv(cipherName, this.key, this.iv);
    this.secret = Buffer.concat([cipher.update(targetBuffer) as any, cipher.final()]);
    crypto.randomFillSync(targetBuffer);
  }
}
