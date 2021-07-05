const compressOclif = require('@oclif/command')

const fs = require('fs');
const path = require("path");

import { compressFiles, deleteFolderRecursive, mkTempFolder, 
    resolveProjectPathSync, resolveAppNameSync, mkdirsSync } from '@steedos/metadata-core';
import { EINPROGRESS } from 'constants';

const loglevels  = {
    debug:1,
    info:2,
    warn:3
}
class CompressCommand extends compressOclif.Command {
    async run() {
        try{

            const { args, flags } = this.parse(CompressCommand);
            // console.log('flags', flags);
            // console.log('args', args);
    
            var sourcePath = flags.appPath 
            var cwdPath = process.cwd();
            if(!path.isAbsolute(sourcePath)){
                sourcePath = path.join(cwdPath, sourcePath);
            }
            var packageName = flags.packageName
            var tempDir = mkTempFolder('compress-');
            var logLever = flags.loglevel;
            if(!logLever){
                logLever = 'warn'
            }
            var showLog = false;
            if(loglevels[logLever] < 2){
                showLog = true;
            } 
    
            var option = { includeJs: true, tableTitle: 'Steedos Package Build: Packaged files',tableSubTitle:'Steedos Package Build: Unsupported files', showLog: showLog};
            const cols = [
                { key: 'type', label: 'TYPE' },
                { key: 'path', label: 'PROJECT PATH' }
            ];
            option['cols'] = cols;

            var projectPath = resolveProjectPathSync(sourcePath);
            
            if(!fs.existsSync(sourcePath)){
                throw new Error('no such file or directory');
            }

            compressFiles(sourcePath, sourcePath, tempDir, option, async function(base64){
    
                const dataBuffer = Buffer.from(base64, 'base64');
                if(!packageName){
                    packageName = path.basename(sourcePath);
                }
                fs.writeFileSync(path.join(cwdPath, packageName+'.package'), dataBuffer);
                console.info('package build success.', path.join(cwdPath, packageName+'.package'));
                deleteFolderRecursive(tempDir);
            });
        }catch(error){
            console.error('Error: '+error.message);
        }
    }
}

CompressCommand.flags = {
    appPath : compressOclif.flags.string({char: 'p', description: 'appPath', required: true}),
    packageName : compressOclif.flags.string({char: 'n', description: 'package name'}),
    loglevel: compressOclif.flags.string({char: 'l', description: '(debug|info|warn)  [default: warn] logging level for this command invocation'})
}

module.exports = CompressCommand