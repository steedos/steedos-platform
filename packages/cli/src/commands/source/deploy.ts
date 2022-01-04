const depOclif = require('@oclif/command')

const fs = require('fs');
const os = require('os');
const path = require("path");
import { sendToServer } from '../../source/deploy/index'

const chalk = require('chalk');

import {
    compressFiles, deleteFolderRecursive, mkTempFolder,
    resolveProjectPathSync, getPackagePath, uncompressPackages
} from '@steedos/metadata-core';
class DeployCommand extends depOclif.Command {
    async run() {
        try {
            const { args, flags } = this.parse(DeployCommand);

            let sourcePath = flags.sourcePath || process.cwd();
            var stat = fs.lstatSync(sourcePath);
            var is_directory = stat.isDirectory();

            var baseName = path.basename(sourcePath);
            if (!is_directory) {
                sourcePath = path.join(sourcePath, '..');
            }

            process.chdir(sourcePath);  // cd
            sourcePath = process.cwd()

            if (!is_directory) {
                sourcePath = path.join(sourcePath, baseName)
            }

            var tempDir = mkTempFolder('deploy-');

            var option = { includeJs: false, tableTitle: 'Steedos Deploy', showLog: true, inDeploy: true };

            const projectPath = resolveProjectPathSync(sourcePath);
            const packagePath = getPackagePath(sourcePath);
            const appPath = path.join(projectPath, packagePath);

            const defaultPackagePath = path.join(projectPath, packagePath);

            var loopDir = sourcePath;
            var nextDir;

            var doBreak = false;
            var count = 1;
            while (!doBreak) {
                if (loopDir === defaultPackagePath || count++ == 15) {
                    break;
                }
                nextDir = path.resolve(loopDir, '..');
                if (nextDir == loopDir) {
                    throw new Error('path to deploy is not a child of the defaultpackagepath, use command: setDefaultPackagePath.');
                }
                loopDir = nextDir;
            }

            compressFiles(appPath, sourcePath, tempDir, option, async function (base64, zipDir) {
                await sendToServer(base64);
                deleteFolderRecursive(tempDir);
            });


        } catch (err) {
            console.log(err);
            throw err;
        }
    }
}

DeployCommand.flags = {
    sourcePath: depOclif.flags.string({ char: 'p', description: 'Submit the local file under the path to the server' }),
}

DeployCommand.description =
    ' Use this command to deploy source (metadata that’s in source format)\n'
    + 'To deploy metadata that’s in metadata format, use "steedos source:deploy".\n'
    + '\n'
    + 'The source you deploy overwrites the corresponding metadata on the server. '
    + 'This command does not attempt to merge your source with the versions on the server.\n'
    + '\n'
    + 'Examples:\n'
    + '\n'
    + 'To deploy the source files in a directory:\n'
    + '    $ steedos source:deploy -p path/to/source\n'
    + 'To deploy a specific custom object and the objects whose source is in a directory:\n'
    + '    $ steedos source:deploy -p "path/to/custom/objects/myObject.object.yml"\n'
    + 'or"\n'
    + '    $ steedos source:deploy -p "path/to/source/objects/my_object"\n'
    + '\n'

module.exports = DeployCommand