/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
/*
 * NOTE: This is the lowest level class in core and should not import any
 * other local classes or utils to prevent circular dependencies or testing
 * stub issues.
 */

import { NamedError } from '@salesforce/kit';
import { AnyJson, asString, ensureJsonMap, ensureString, isAnyJson, isObject, Optional } from '@salesforce/ts-types';
import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';

export type Tokens = Array<string | boolean | number | null | undefined>;

class Key {
  constructor(private packageName: string, private bundleName: string) {}

  public toString() {
    return `${this.packageName}:${this.bundleName}`;
  }
}

/**
 * A loader function to return messages.
 * @param locale The local set by the framework.
 */
export type LoaderFunction = (locale: string) => Messages;

/**
 * The core message framework manages messages and allows them to be accessible by
 * all plugins and consumers of sfdx-core. It is set up to handle localization down
 * the road at no additional effort to the consumer. Messages can be used for
 * anything from user output (like the console), to error messages, to returned
 * data from a method.
 *
 * Messages are loaded from loader functions. The loader functions will only run
 * when a message is required. This prevents all messages from being loaded into memory at
 * application startup. The functions can load from memory, a file, or a server.
 *
 * In the beginning of your app or file, add the loader functions to be used later. If using
 * json or js files in a root messages directory (`<moduleRoot>/messages`), load the entire directory
 * automatically with {@link Messages.importMessagesDirectory}. Message files must be in `.json` or `.js`
 * that exports a json object with **only** top level key-value pairs. The values support
 * [util.format](https://nodejs.org/api/util.html#util_util_format_format_args) style strings
 * that apply the tokens passed into {@link Message.getMessage}
 *
 * A sample message file.
 * ```
 * {
 *    'msgKey': 'A message displayed in the terminal'
 * }
 * ```
 *
 * **Note:** When running unit tests individually, you may see errors that the messages aren't found.
 * This is because `index.js` isn't loaded when tests run like they are when the package is required.
 * To allow tests to run, import the message directory in each test (it will only
 * do it once) or load the message file the test depends on individually.
 *
 * ```
 * // Create loader functions for all files in the messages directory
 * Messages.importMessagesDirectory(__dirname);
 *
 * // Now you can use the messages from anywhere in your code or file.
 * // If using importMessageDirectory, the bundle name is the file name.
 * const messages : Messages = Messages.loadMessages(packageName, bundleName);
 *
 * // Messages now contains all the message in the bundleName file.
 * messages.getMessage('JsonParseError');
 * ```
 */
export class Messages {
  /**
   * Internal readFile. Exposed for unit testing. Do not use util/fs.readFile as messages.js
   * should have no internal dependencies.
   * @param filePath read file target.
   * @ignore
   */
  public static _readFile = (filePath: string): AnyJson => {
    return require(filePath);
  };

  /**
   * Get the locale. This will always return 'en_US' but will return the
   * machine's locale in the future.
   */
  public static getLocale(): string {
    return 'en_US';
  }

  /**
   * Set a custom loader function for a package and bundle that will be called on {@link Messages.loadMessages}.
   * @param packageName The npm package name.
   * @param bundle The name of the bundle.
   * @param loader The loader function.
   */
  public static setLoaderFunction(packageName: string, bundle: string, loader: LoaderFunction): void {
    this.loaders.set(new Key(packageName, bundle).toString(), loader);
  }

  /**
   * Generate a file loading function. Use {@link Messages.importMessageFile} unless
   * overriding the bundleName is required, then manually pass the loader
   * function to {@link Messages.setLoaderFunction}.
   *
   * @param bundleName The name of the bundle.
   * @param filePath The messages file path.
   */
  public static generateFileLoaderFunction(bundleName: string, filePath: string): LoaderFunction {
    return (locale: string): Messages => {
      // Anything can be returned by a js file, so stringify the results to ensure valid json is returned.
      const fileContents: string = JSON.stringify(Messages._readFile(filePath));

      // If the file is empty, JSON.stringify will turn it into "" which will validate on parse, so throw.
      if (!fileContents || fileContents === 'null' || fileContents === '""') {
        const error = new Error(`Invalid message file: ${filePath}. No content.`);
        error.name = 'SfdxError';
        throw error;
      }

      let json;

      try {
        json = JSON.parse(fileContents);

        if (!isObject(json)) {
          // Bubble up
          throw new Error(`Unexpected token. Found returned content type '${typeof json}'.`);
        }
      } catch (err) {
        // Provide a nicer error message for a common JSON parse error; Unexpected token
        if (err.message.startsWith('Unexpected token')) {
          const parseError = new Error(`Invalid JSON content in message file: ${filePath}\n${err.message}`);
          parseError.name = err.name;
          throw parseError;
        }
        throw err;
      }

      const map = new Map<string, AnyJson>(Object.entries(json));

      return new Messages(bundleName, locale, map);
    };
  }

  /**
   * Add a single message file to the list of loading functions using the file name as the bundle name.
   * The loader will only be added if the bundle name is not already taken.
   *
   * @param packageName The npm package name.
   * @param filePath The path of the file.
   */
  public static importMessageFile(packageName: string, filePath: string): void {
    if (path.extname(filePath) !== '.json' && path.extname(filePath) !== '.js') {
      throw new Error(`Only json and js message files are allowed, not ${path.extname(filePath)}`);
    }
    const bundleName = path.basename(filePath, path.extname(filePath));

    if (!Messages.isCached(packageName, bundleName)) {
      this.setLoaderFunction(packageName, bundleName, Messages.generateFileLoaderFunction(bundleName, filePath));
    }
  }

  /**
   * Import all json and js files in a messages directory. Use the file name as the bundle key when
   * {@link Messages.loadMessages} is called. By default, we're assuming the moduleDirectoryPart is a
   * typescript project and will truncate to root path (where the package.json file is). If your messages
   * directory is in another spot or you are not using typescript, pass in false for truncateToProjectPath.
   *
   * ```
   * // e.g. If your message directory is in the project root, you would do:
   * Messages.importMessagesDirectory(__dirname);
   * ```
   *
   * @param moduleDirectoryPath The path to load the messages folder.
   * @param truncateToProjectPath Will look for the messages directory in the project root (where the package.json file is located).
   * i.e., the module is typescript and the messages folder is in the top level of the module directory.
   * @param packageName The npm package name. Figured out from the root directory's package.json.
   */
  public static importMessagesDirectory(
    moduleDirectoryPath: string,
    truncateToProjectPath = true,
    packageName?: string
  ): void {
    let moduleMessagesDirPath = moduleDirectoryPath;
    let projectRoot = moduleDirectoryPath;

    if (!path.isAbsolute(moduleDirectoryPath)) {
      throw new Error('Invalid module path. Relative URLs are not allowed.');
    }

    while (projectRoot.length >= 0) {
      try {
        fs.statSync(path.join(projectRoot, 'package.json'));
        break;
      } catch (err) {
        if (err.code !== 'ENOENT') throw err;
        projectRoot = projectRoot.substring(0, projectRoot.lastIndexOf(path.sep));
      }
    }

    if (truncateToProjectPath) {
      moduleMessagesDirPath = projectRoot;
    }

    if (!packageName) {
      const errMessage = `Invalid or missing package.json file at '${moduleMessagesDirPath}'. If not using a package.json, pass in a packageName.`;
      try {
        packageName = asString(
          ensureJsonMap(Messages._readFile(path.join(moduleMessagesDirPath, 'package.json'))).name
        );
        if (!packageName) {
          throw new NamedError('MissingPackageName', errMessage);
        }
      } catch (err) {
        throw new NamedError('MissingPackageName', errMessage, err);
      }
    }

    moduleMessagesDirPath += `${path.sep}messages`;

    for (const file of fs.readdirSync(moduleMessagesDirPath)) {
      const filePath = path.join(moduleMessagesDirPath, file);
      const stat = fs.statSync(filePath);

      if (stat) {
        if (stat.isDirectory()) {
          // When we support other locales, load them from /messages/<local>/<bundleName>.json
          // Change generateFileLoaderFunction to handle loading locales.
        } else if (stat.isFile()) {
          this.importMessageFile(packageName, filePath);
        }
      }
    }
  }

  /**
   * Load messages for a given package and bundle. If the bundle is not already cached, use the loader function
   * created from {@link Messages.setLoaderFunction} or {@link Messages.importMessagesDirectory}.
   *
   * @param packageName The name of the npm package.
   * @param bundleName The name of the bundle to load.
   */
  public static loadMessages(packageName: string, bundleName: string): Messages {
    const key = new Key(packageName, bundleName);
    let messages: Optional<Messages>;

    if (this.isCached(packageName, bundleName)) {
      messages = this.bundles.get(key.toString());
    } else if (this.loaders.has(key.toString())) {
      const loader = this.loaders.get(key.toString());
      if (loader) {
        messages = loader(Messages.getLocale());
        this.bundles.set(key.toString(), messages);
        messages = this.bundles.get(key.toString());
      }
    }
    if (messages) {
      return messages;
    }

    // Don't use messages inside messages
    throw new NamedError('MissingBundleError', `Missing bundle ${key.toString()} for locale ${Messages.getLocale()}.`);
  }

  /**
   * Check if a bundle already been loaded.
   * @param packageName The npm package name.
   * @param bundleName The bundle name.
   */
  public static isCached(packageName: string, bundleName: string) {
    return this.bundles.has(new Key(packageName, bundleName).toString());
  }

  // It would be AWESOME to use Map<Key, Message> but js does an object instance comparison and doesn't let you
  // override valueOf or equals for the === operator, which map uses. So, Use Map<String, Message>

  // A map of loading functions to dynamically load messages when they need to be used
  private static loaders: Map<string, (locale: string) => Messages> = new Map<string, (locale: string) => Messages>();

  // A map cache of messages bundles that have already been loaded
  private static bundles: Map<string, Messages> = new Map<string, Messages>();

  /**
   * The locale of the messages in this bundle.
   */
  public readonly locale: string;
  /**
   * The bundle name.
   */
  public readonly bundleName: string;

  /**
   * Create a new messages bundle.
   *
   * **Note:** Use {Messages.loadMessages} unless you are writing your own loader function.
   * @param bundleName The bundle name.
   * @param locale The locale.
   * @param messages The messages. Can not be modified once created.
   */
  constructor(bundleName: string, locale: string, private messages: Map<string, AnyJson>) {
    this.bundleName = bundleName;
    this.locale = locale;
  }

  /**
   * Get a message using a message key and use the tokens as values for tokenization.
   * @param key The key of the message.
   * @param tokens The values to substitute in the message.
   *
   * **See** https://nodejs.org/api/util.html#util_util_format_format_args
   */
  public getMessage(key: string, tokens: Tokens = []): string {
    return this.getMessageWithMap(key, tokens, this.messages);
  }

  private getMessageWithMap(key: string, tokens: Tokens = [], map: Map<string, AnyJson>): string {
    // Allow nested keys for better grouping
    const group = key.match(/([a-zA-Z0-9_-]+)\.(.*)/);
    if (group) {
      const parentKey = group[1];
      const childKey = group[2];
      const childObject = map.get(parentKey);
      if (childObject && isAnyJson(childObject)) {
        const childMap = new Map<string, AnyJson>(Object.entries(childObject));
        return this.getMessageWithMap(childKey, tokens, childMap);
      }
    }

    if (!map.has(key)) {
      // Don't use messages inside messages
      throw new NamedError(
        'MissingMessageError',
        `Missing message ${this.bundleName}:${key} for locale ${Messages.getLocale()}.`
      );
    }
    const msg = ensureString(map.get(key));
    return util.format(msg, ...tokens);
  }
}
