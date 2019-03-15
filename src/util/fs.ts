/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { parseJson, parseJsonMap } from '@salesforce/kit';
import { AnyJson, JsonMap, Optional } from '@salesforce/ts-types';
import * as fsLib from 'fs';
import * as mkdirpLib from 'mkdirp';
import * as path from 'path';
import { promisify } from 'util';

export const fs = {
  /**
   * The default file system mode to use when creating directories.
   */
  DEFAULT_USER_DIR_MODE: '700',

  /**
   * The default file system mode to use when creating files.
   */
  DEFAULT_USER_FILE_MODE: '600',

  /**
   * A convenience reference to {@link https://nodejs.org/api/fsLib.html#fs_fs_constants}
   * to reduce the need to import multiple `fs` modules.
   */
  constants: fsLib.constants,

  /**
   * Promisified version of {@link https://nodejs.org/api/fsLib.html#fs_fs_readfile_path_options_callback|fsLib.readFile}.
   */
  readFile: promisify(fsLib.readFile),

  /**
   * Promisified version of {@link https://nodejs.org/api/fsLib.html#fs_fs_readdir_path_options_callback|fsLib.readdir}.
   */
  readdir: promisify(fsLib.readdir),

  /**
   * Promisified version of {@link https://nodejs.org/api/fsLib.html#fs_fs_writefile_file_data_options_callback|fsLib.writeFile}.
   */
  writeFile: promisify(fsLib.writeFile),

  /**
   * Promisified version of {@link https://nodejs.org/api/fsLib.html#fs_fs_access_path_mode_callback|fsLib.access}.
   */
  access: promisify(fsLib.access),

  /**
   * Promisified version of {@link https://nodejs.org/api/fsLib.html#fs_fs_open_path_flags_mode_callback|fsLib.open}.
   */
  open: promisify(fsLib.open),

  /**
   * Promisified version of {@link https://nodejs.org/api/fsLib.html#fs_fs_unlink_path_callback|fsLib.unlink}.
   */
  unlink: promisify(fsLib.unlink),

  /**
   * Promisified version of {@link https://nodejs.org/api/fsLib.html#fs_fs_readdir_path_options_callback|fsLib.rmdir}.
   */
  rmdir: promisify(fsLib.rmdir),

  /**
   * Promisified version of {@link https://nodejs.org/api/fsLib.html#fs_fs_fstat_fd_callback|fsLib.stat}.
   */
  stat: promisify(fsLib.stat),

  /**
   * Promisified version of {@link https://npmjs.com/package/mkdirp|mkdirp}.
   */
  // @ts-ignore TODO: figure out how to bind to correct promisify overload
  mkdirp: (folderPath: string, mode?: string | object): Promise<void> => promisify(mkdirpLib)(folderPath, mode),

  /**
   * Deletes a folder recursively, removing all descending files and folders.
   *
   * **Throws** *PathIsNullOrUndefined* The path is not defined.
   * **Throws** *DirMissingOrNoAccess* The folder or any sub-folder is missing or has no access.
   * @param {string} dirPath The path to remove.
   */
  remove: async (dirPath: string): Promise<void> => {
    if (!dirPath) {
      throw new Error('Path is null or undefined.');
    }
    try {
      await fs.access(dirPath, fsLib.constants.R_OK);
    } catch (err) {
      throw new Error(`The path: ${dirPath} doesn\'t exist or access is denied.`);
    }
    const files = await fs.readdir(dirPath);
    const stats = await Promise.all(files.map(file => fs.stat(path.join(dirPath, file))));
    const metas = stats.map((value, index) => Object.assign(value, { path: path.join(dirPath, files[index]) }));
    await Promise.all(metas.map(meta => (meta.isDirectory() ? fs.remove(meta.path) : fs.unlink(meta.path))));
    await fs.rmdir(dirPath);
  },

  /**
   * Searches a file path in an ascending manner (until reaching the filesystem root) for the first occurrence a
   * specific file name.  Resolves with the directory path containing the located file, or `null` if the file was
   * not found.
   *
   * @param dir The directory path in which to start the upward search.
   * @param file The file name to look for.
   */
  traverseForFile: async (dir: string, file: string): Promise<Optional<string>> => {
    let foundProjectDir: Optional<string>;
    try {
      await fs.stat(path.join(dir, file));
      foundProjectDir = dir;
    } catch (err) {
      if (err && err.code === 'ENOENT') {
        const nextDir = path.resolve(dir, '..');
        if (nextDir !== dir) {
          // stop at root
          foundProjectDir = await fs.traverseForFile(nextDir, file);
        }
      }
    }
    return foundProjectDir;
  },

  /**
   * Read a file and convert it to JSON. Returns the contents of the file as a JSON object
   *
   * @param jsonPath The path of the file.
   * @param throwOnEmpty Whether to throw an error if the JSON file is empty.
   */
  readJson: async (jsonPath: string, throwOnEmpty?: boolean): Promise<AnyJson> => {
    const fileData = await fs.readFile(jsonPath, 'utf8');
    return await parseJson(fileData, jsonPath, throwOnEmpty);
  },

  /**
   * Read a file and convert it to JSON, throwing an error if the parsed contents are not a `JsonMap`.
   *
   * @param jsonPath The path of the file.
   * @param throwOnEmpty Whether to throw an error if the JSON file is empty.
   */
  readJsonMap: async (jsonPath: string, throwOnEmpty?: boolean): Promise<JsonMap> => {
    const fileData = await fs.readFile(jsonPath, 'utf8');
    return await parseJsonMap(fileData, jsonPath, throwOnEmpty);
  },

  /**
   * Convert a JSON-compatible object to a `string` and write it to a file.
   *
   * @param jsonPath The path of the file to write.
   * @param data The JSON object to write.
   */
  writeJson: async (jsonPath: string, data: AnyJson): Promise<void> => {
    const fileData: string = JSON.stringify(data, null, 4);
    await fs.writeFile(jsonPath, fileData, {
      encoding: 'utf8',
      mode: fs.DEFAULT_USER_FILE_MODE
    });
  }
};
