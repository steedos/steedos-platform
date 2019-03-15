/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { env } from '@salesforce/kit';
import * as os from 'os';
import * as path from 'path';
import { fs } from '../util/fs';

/**
 * Represents an environment mode.  Supports `production`, `development`, `demo`, and `test`
 * with the default mode being `production`.
 *
 * To set the mode, `export SFDX_ENV=<mode>` in your current environment.
 */
export enum Mode {
  PRODUCTION = 'production',
  DEVELOPMENT = 'development',
  DEMO = 'demo',
  TEST = 'test'
}

/**
 * Global constants, methods, and configuration.
 */
export class Global {
  /**
   * The global folder in which state is stored.
   */
  public static readonly STATE_FOLDER = '.steedos';

  /**
   * The full system path to the global state folder.
   *
   * **See** {@link Global.STATE_FOLDER}
   */
  public static readonly DIR: string = path.join(os.homedir(), Global.STATE_FOLDER);

  /**
   * The full system path to the global log file.
   */
  public static readonly LOG_FILE_PATH: string = path.join(Global.DIR, 'steedos.log');

  /**
   * Gets the current mode environment variable as a {@link Mode} instance.
   *
   * ```
   * console.log(Global.getEnvironmentMode() === Mode.PRODUCTION);
   * ```
   */
  public static getEnvironmentMode(): Mode {
    return Mode[env.getKeyOf('SFDX_ENV', Mode, Mode.PRODUCTION, value => value.toUpperCase())];
  }

  /**
   * Creates a directory within {@link Global.DIR}, or {@link Global.DIR} itself if the `dirPath` param
   * is not provided. This is resolved or rejected when the directory creation operation has completed.
   *
   * @param dirPath The directory path to be created within {@link Global.DIR}.
   */
  public static async createDir(dirPath?: string): Promise<void> {
    dirPath = dirPath ? path.join(Global.DIR, dirPath) : Global.DIR;
    await fs.mkdirp(dirPath, fs.DEFAULT_USER_DIR_MODE);
  }
}
