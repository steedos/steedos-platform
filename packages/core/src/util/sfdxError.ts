/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { NamedError } from '@salesforce/kit';
import { ensure, isString, JsonMap, Optional } from '@salesforce/ts-types';
import { Messages, Tokens } from './messages';

/**
 * A class to manage all the keys and tokens for a message bundle to use with SfdxError.
 *
 * ```
 * SfdxError.create(new SfdxErrorConfig('MyPackage', 'apex', 'runTest').addAction('apexErrorAction1', [className]));
 * ```
 */
export class SfdxErrorConfig {
  /**
   * The name of the package
   */
  public readonly packageName: string;

  /**
   * The name of the bundle
   */
  public readonly bundleName: string;

  /**
   * The error key
   */
  public errorKey: string;

  private errorTokens: Tokens;
  private messages?: Messages;
  private actions = new Map<string, Tokens>();

  /**
   * Create a new SfdxErrorConfig.
   * @param packageName The name of the package.
   * @param bundleName The message bundle.
   * @param errorKey The error message key.
   * @param errorTokens The tokens to use when getting the error message.
   * @param actionKey The action message key.
   * @param actionTokens The tokens to use when getting the action message(s).
   */
  constructor(
    packageName: string,
    bundleName: string,
    errorKey: string,
    errorTokens: Tokens = [],
    actionKey?: string,
    actionTokens?: Tokens
  ) {
    this.packageName = packageName;
    this.bundleName = bundleName;
    this.errorKey = errorKey;
    this.errorTokens = errorTokens;
    if (actionKey) this.addAction(actionKey, actionTokens);
  }

  /**
   * Set the error key.
   * @param key The key to set.
   * @returns {SfdxErrorConfig} For convenience `this` object is returned.
   */
  public setErrorKey(key: string): SfdxErrorConfig {
    this.errorKey = key;
    return this;
  }

  /**
   * Set the error tokens.
   * @param tokens The tokens to set. For convenience `this` object is returned.
   */
  public setErrorTokens(tokens: Tokens): SfdxErrorConfig {
    this.errorTokens = tokens;
    return this;
  }

  /**
   * Add an error action to assist the user with a resolution. For convenience `this` object is returned.
   * @param actionKey The action key in the message bundle.
   * @param actionTokens The action tokens for the string.
   */
  public addAction(actionKey: string, actionTokens: Tokens = []): SfdxErrorConfig {
    this.actions.set(actionKey, actionTokens);
    return this;
  }

  /**
   * Load the messages using `Messages.loadMessages`. Returns the loaded messages.
   */
  public load(): Messages {
    this.messages = Messages.loadMessages(this.packageName, this.bundleName);
    return this.messages;
  }

  /**
   * Get the error message using messages.getMessage.
   * **Throws** If `errorMessages.load` was not called first.
   */
  public getError(): string {
    if (!this.messages) {
      throw new SfdxError('SfdxErrorConfig not loaded.');
    }
    return this.messages.getMessage(this.errorKey, this.errorTokens);
  }

  /**
   * Get the action messages using messages.getMessage.
   * **@throws** If `errorMessages.load` was not called first.
   */
  public getActions(): Optional<string[]> {
    if (!this.messages) {
      throw new SfdxError('SfdxErrorConfig not loaded.');
    }

    if (this.actions.size === 0) return;

    const actions: string[] = [];
    this.actions.forEach((tokens, key) => {
      const messages = this.messages;
      if (messages) {
        actions.push(messages.getMessage(key, tokens));
      }
    });
    return actions;
  }

  /**
   * Remove all actions from this error config. Useful when reusing SfdxErrorConfig for other error messages within
   * the same bundle. For convenience `this` object is returned.
   */
  public removeActions(): SfdxErrorConfig {
    this.actions = new Map();
    return this;
  }
}

/**
 * A generalized sfdx error which also contains an action. The action is used in the
 * CLI to help guide users past the error.
 *
 * To throw an error in a synchronous function you must either pass the error message and actions
 * directly to the constructor, e.g.
 *
 * ```
 * // To load a message bundle:
 * Messages.importMessagesDirectory(__dirname);
 * this.messages = Messages.loadMessages('myPackageName', 'myBundleName');
 * // Note that __dirname should contain a messages folder.
 *
 * // To throw an error associated with the message from the bundle:
 * throw SfdxError.create('myPackageName', 'myBundleName', 'MyErrorMessageKey', [messageToken1]);
 *
 * // To throw a non-bundle based error:
 * throw new SfdxError(myErrMsg, 'MyErrorName');
 * ```
 */
export class SfdxError extends NamedError {
  /**
   * Create a new `SfdxError`.
   * @param packageName The message package name used to create the `SfdxError`.
   * @param bundleName The message bundle name used to create the `SfdxError`.
   * @param key The key within the bundle for the message.
   * @param tokens The values to use for message tokenization.
   */
  public static create(packageName: string, bundleName: string, key: string, tokens?: Tokens): SfdxError;

  /**
   * Create a new SfdxError.
   * @param errorConfig The `SfdxErrorConfig` object used to create the SfdxError.
   */
  public static create(errorConfig: SfdxErrorConfig): SfdxError;

  // The create implementation function.
  public static create(
    nameOrConfig: string | SfdxErrorConfig,
    bundleName?: string,
    key?: string,
    tokens?: Tokens
  ): SfdxError {
    let errorConfig: SfdxErrorConfig;

    if (isString(nameOrConfig)) {
      errorConfig = new SfdxErrorConfig(nameOrConfig, ensure(bundleName), ensure(key), tokens);
    } else {
      errorConfig = nameOrConfig;
    }

    errorConfig.load();

    return new SfdxError(errorConfig.getError(), errorConfig.errorKey, errorConfig.getActions());
  }

  /**
   * Convert an Error to an SfdxError.
   * @param err The error to convert.
   */
  public static wrap(err: Error): SfdxError {
    const sfdxError = new SfdxError(err.message, err.name);
    if (sfdxError.stack) {
      sfdxError.stack = sfdxError.stack.replace(`${err.name}: ${err.message}`, 'Outer stack:');
      sfdxError.stack = `${err.stack}\n${sfdxError.stack}`;
    }
    return sfdxError;
  }

  /**
   * The message string. Error.message
   */
  public message!: string;

  /**
   * Action messages. Hints to the users regarding what can be done to fix related issues.
   */
  public actions?: string[];

  /**
   * SfdxCommand can return this process exit code.
   */
  public exitCode: number;

  /**
   * The related command name for this error.
   */
  public commandName?: string;

  // Additional data helpful for consumers of this error.  E.g., API call result
  public data: any; // tslint:disable-line:no-any

  /**
   * Create an SfdxError.
   * @param message The error message.
   * @param name The error name. Defaults to 'SfdxError'.
   * @param actions The action message(s).
   * @param exitCode The exit code which will be used by SfdxCommand.
   * @param cause The underlying error that caused this error to be raised.
   */
  constructor(message: string, name?: string, actions?: string[], exitCode?: number, cause?: NamedError) {
    super(name || 'SfdxError', message, cause);
    this.actions = actions;
    this.exitCode = exitCode || 1;
  }

  /**
   * Sets the name of the command. For convenience `this` object is returned.
   * @param commandName The command name.
   */
  public setCommandName(commandName: string): SfdxError {
    this.commandName = commandName;
    return this;
  }

  /**
   * An additional payload for the error. For convenience `this` object is returned.
   * @param data The payload data.
   */
  public setData(data: unknown): SfdxError {
    this.data = data;
    return this;
  }

  /**
   * Convert an {@link SfdxError} state to an object. Returns a plain object representing the state of this error.
   */
  public toObject(): JsonMap {
    const obj: JsonMap = {
      name: this.name,
      message: this.message || this.name,
      exitCode: this.exitCode,
      actions: this.actions
    };

    if (this.commandName) {
      obj.commandName = this.commandName;
    }

    if (this.data) {
      obj.data = this.data;
    }

    return obj;
  }
}
