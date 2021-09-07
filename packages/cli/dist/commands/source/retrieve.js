"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const retOclif = require('@oclif/command');
const chalk = require('chalk');
const fs = require('fs');
const path = require("path");
const yaml = require("js-yaml");
const index_1 = require("../../source/retrieve/index");
const metadata_core_1 = require("@steedos/metadata-core");
class RetrieveCommand extends retOclif.Command {
    async run() {
        const { args, flags } = this.parse(RetrieveCommand);
        var requestYmlBase64;
        var ymlDir = flags.manifest;
        var metadata = flags.metadata;
        var serverDir = flags.serverDir || process.cwd();
        const projectPath = metadata_core_1.resolveProjectPathSync(serverDir);
        const packagePath = metadata_core_1.getPackagePath(serverDir);
        const appPath = path.join(projectPath, packagePath);
        var options = { packageYmlDir: ymlDir, metadata, serverDir };
        requestYmlBase64 = metadata_core_1.getRetrievePackageInfo(options);
        // var file = Buffer.from(requestYmlBase64, 'base64');
        // fs.writeFileSync("c:/cli/testReq.yml", file);
        index_1.getFromServer(requestYmlBase64, async function (zipBuffer) {
            // 解压以后根据配置文件部署到相应位置
            await metadata_core_1.decompressAndDeploy(zipBuffer, appPath);
        });
    }
}
RetrieveCommand.flags = {
    serverDir: retOclif.flags.string({ char: 'p', description: 'generate request according to the path and update it' }),
    manifest: retOclif.flags.string({ char: 'y', description: 'file path for manifest (package.yml) of components to deploy' }),
    metadata: retOclif.flags.string({ char: 'm', description: 'metadata' }),
};
RetrieveCommand.description =
    'Use this command to retrieve source (metadata that’s in source format)\n'
        + 'To retrieve metadata that’s in metadata format, use "steedos source:retrieve".\n'
        + '\n'
        + 'The source you retrieve overwrites the corresponding source files in your local project. '
        + 'This command does not attempt to merge the source from your org with your local source files.\n'
        + '\n'
        + 'Examples:\n'
        + '\n'
        + 'To retrieve the source files in a directory:\n'
        + '    $ steedos source:retrieve -p path/to/source\n'
        + 'To retrieve a specific Custom object and the objects whose source is in a directory:\n'
        + '    $ steedos source:retrieve -p "path/to/custom/objects/myObject.object.yml"\n'
        + 'or\n'
        + '    $ steedos source:retrieve -p "path/to/source/objects/my_object"\n'
        + 'To retrieve all Custom objects:\n'
        + '    $ steedos source:retrieve -m CustomObject\n'
        + 'To retrieve a specific Custom object:\n'
        + '    $ steedos source:retrieve -m CustomObject:myObject\n'
        + '\n'
        + 'To retrieve all metadata components listed in a manifest:\n'
        + '    $ steedos source:retrieve -y path/to/package.yml\n'
        + '\n'
        + '\n'
        + "MetaDataList:\n"
        + JSON.stringify(metadata_core_1.getAllowSyncMetadataKeys()) + '\n';
module.exports = RetrieveCommand;
//# sourceMappingURL=retrieve.js.map