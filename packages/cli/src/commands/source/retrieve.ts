const retOclif = require('@oclif/command')

const chalk= require('chalk');
const fs = require('fs');
const path = require("path");
const yaml = require("js-yaml");
const _ = require('underscore');

import { getFromServer } from '../../source/retrieve/index'

import { resolveProjectPathSync, getPackagePath, decompressAndDeploy, getRetrievePackageInfo, getAllowSyncMetadataKeys, getPackageYml, hasParent, getParentMetadataName, SteedosMetadataTypeInfoKeys as TypeInfoKeys } from '@steedos/metadata-core'


class RetrieveCommand extends retOclif.Command {
    async run() {
        const { args, flags } = this.parse(RetrieveCommand);
        var requestYmlBase64;

        var ymlDir = flags.manifest
        var metadata = flags.metadata
        var serverDir = flags.serverDir||process.cwd();

        const projectPath = resolveProjectPathSync(serverDir);
        const packagePath = getPackagePath(serverDir);
        const appPath = path.join(projectPath, packagePath);
        
        //retrieve -p 

        let is_directory = false;
        if(flags.serverDir){
            const stat = fs.lstatSync(flags.serverDir);
            is_directory = stat.isDirectory();
        }
        if(!ymlDir && flags.serverDir && is_directory){
            //getPackageYml 返回了所有源数据明细
            var packageJson = getPackageYml(appPath, serverDir, {includeJs: false});
            //如果是源数据的parent是object，则取*
            for(const metadataName in packageJson){
                if(hasParent(metadataName)){
                  var parentMetadataName = getParentMetadataName(metadataName);
                  if(parentMetadataName === TypeInfoKeys.Object){
                      const info: any = [];
                      _.map(packageJson[metadataName], (item)=>{
                        const foo = item.split('.');
                        if(foo.length > 0){
                            info.push(`${foo[0]}.*`)
                        }
                      })
                      packageJson[metadataName] = _.uniq(info)
                  }
                }
                // else if(metadataName === TypeInfoKeys.Object){
                //     const info: any = [];
                //     _.map(packageJson[metadataName], (objectApiName)=>{
                //         info.push(`${objectApiName}.*`)
                //     })
                //     packageJson[metadataName] = _.uniq(info)
                // }
            }

            var packageYml = yaml.dump(packageJson);
            var ymlBuffer = Buffer.from(packageYml);
            requestYmlBase64 = ymlBuffer.toString('base64');
            // fs.writeFileSync("F:/package.yml", packageYml);
        }else{
            var options = { packageYmlDir: ymlDir, metadata, serverDir}
            requestYmlBase64 = getRetrievePackageInfo(options);
            // fs.writeFileSync("F:/package.yml", Buffer.from(requestYmlBase64, 'base64'));
        }

        getFromServer(requestYmlBase64, async function(zipBuffer){
            // 解压以后根据配置文件部署到相应位置
            await decompressAndDeploy(zipBuffer, appPath);
        });


    }
}

RetrieveCommand.flags = {
    serverDir: retOclif.flags.string({char: 'p', description: 'generate request according to the path and update it'}),
    manifest: retOclif.flags.string({char: 'y', description: 'file path for manifest (package.yml) of components to deploy'}),
    metadata: retOclif.flags.string({char: 'm', description: 'metadata'}),
}
RetrieveCommand.description = 
    'Use this command to retrieve source (metadata that’s in source format)\n'
    +'To retrieve metadata that’s in metadata format, use "steedos source:retrieve".\n'
    +'\n'
    +'The source you retrieve overwrites the corresponding source files in your local project. '
    +'This command does not attempt to merge the source from your org with your local source files.\n'
    +'\n'
    +'Examples:\n'
    +'\n'
    +'To retrieve the source files in a directory:\n'
    +'    $ steedos source:retrieve -p path/to/source\n'
    +'To retrieve a specific Custom object and the objects whose source is in a directory:\n'
    +'    $ steedos source:retrieve -p "path/to/custom/objects/myObject.object.yml"\n'
    +'or\n'
    +'    $ steedos source:retrieve -p "path/to/source/objects/my_object"\n'
    +'To retrieve all Custom objects:\n'
    +'    $ steedos source:retrieve -m CustomObject\n'
    +'To retrieve a specific Custom object:\n'
    +'    $ steedos source:retrieve -m CustomObject:myObject\n'
    +'\n'
    +'To retrieve all metadata components listed in a manifest:\n'
    +'    $ steedos source:retrieve -y path/to/package.yml\n'
    +'\n'
    +'\n'
    +"MetaDataList:\n"
    +JSON.stringify(getAllowSyncMetadataKeys())+'\n'

module.exports = RetrieveCommand