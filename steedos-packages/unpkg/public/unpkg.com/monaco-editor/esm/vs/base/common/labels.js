/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { hasDriveLetter, isRootOrDriveLetter } from './extpath.js';
import { Schemas } from './network.js';
import { isWindows } from './platform.js';
import { basename } from './resources.js';
import { URI } from './uri.js';
export function getBaseLabel(resource) {
    if (!resource) {
        return undefined;
    }
    if (typeof resource === 'string') {
        resource = URI.file(resource);
    }
    const base = basename(resource) || (resource.scheme === Schemas.file ? resource.fsPath : resource.path) /* can be empty string if '/' is passed in */;
    // convert c: => C:
    if (isWindows && isRootOrDriveLetter(base)) {
        return normalizeDriveLetter(base);
    }
    return base;
}
export function normalizeDriveLetter(path, continueAsWindows) {
    if (hasDriveLetter(path, continueAsWindows)) {
        return path.charAt(0).toUpperCase() + path.slice(1);
    }
    return path;
}
let normalizedUserHomeCached = Object.create(null);
