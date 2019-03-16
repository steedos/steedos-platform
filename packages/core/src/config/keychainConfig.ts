/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { dirname as pathDirname } from 'path';
import { fs } from '../util/fs';
import { ConfigFile } from './configFile';
import { ConfigContents } from './configStore';

/**
 * Represent a key chain config backed by a json file.
 */
// istanbul ignore next - getPassword/setPassword is always mocked out
export class KeychainConfig extends ConfigFile<ConfigFile.Options> {
  public static getFileName(): string {
    return 'key.json';
  }

  /**
   * Gets default options for the KeychainConfig
   */
  public static getDefaultOptions(): ConfigFile.Options {
    return ConfigFile.getDefaultOptions(true, KeychainConfig.getFileName());
  }

  /**
   * Write the config file with new contents. If no new contents are passed in
   * it will write this.contents that was set from read(). Returns the written contents.
   *
   * @param newContents the new contents of the file
   */
  public async write(newContents?: ConfigContents): Promise<ConfigContents> {
    if (newContents != null) {
      this.setContents(newContents);
    }

    await fs.mkdirp(pathDirname(this.getPath()));

    await fs.writeFile(this.getPath(), JSON.stringify(this.getContents(), null, 4), { mode: '600' });

    return this.getContents();
  }
}
