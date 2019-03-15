/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { fs } from './fs';
/**
 * The name of the project config file.
 * @ignore
 */
// This has to be defined on util to prevent circular deps with project and configFile.
export const STEEDOS_PROJECT_JSON = 'steedos-project.json';

/**
 * Performs an upward directory search for an sfdx project file. Returns the absolute path to the project.
 *
 * **See** {@link SFDX_PROJECT_JSON}
 *
 * **See** {@link traverseForFile}
 *
 * **Throws** *{@link SfdxError}{ name: 'InvalidProjectWorkspace' }* If the current folder is not located in a workspace.
 * @param dir The directory path to start traversing from.
 * @ignore
 */
export async function resolveProjectPath(dir: string = process.cwd()): Promise<string> {
  const projectPath = await fs.traverseForFile(dir, STEEDOS_PROJECT_JSON);
  if (!projectPath) {
    throw new Error('Invalid Project Workspace');
  }
  return projectPath;
}
