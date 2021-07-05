const convertOclif = require('@oclif/command')
const path = require('path');

import {filesTolocalJson} from '../../source/convert/jsontofiles';
import {loadOldFileToJson} from '../../source/convert/loadfiletojson';

import {mkdirsSync} from '@steedos/metadata-core';

class ConvertCommand extends convertOclif.Command {
    async run() {
        const { args, flags } = this.parse(ConvertCommand);
        // console.log('flags', flags);
        // console.log('args', args);

        var oldFilesPath = flags.oldFilesPath
        var targetPath = flags.targetPath

        if(!oldFilesPath){
            throw new Error('需要传入老文件路径,参数-o')
        }
        // if(!targetPath){
        //     throw new Error('需要传入新文件生成的绝对路径,参数-t')
        // }
        //测试本地旧文件路径
        // oldFilesPath = path.join("C:/clonefile/steedos-app-crm", "src");
        
        let steedosPackageJson = await loadOldFileToJson(oldFilesPath);
        if(!targetPath){
            targetPath = oldFilesPath
            targetPath = path.join( targetPath, '..');
        }
        if(!path.isAbsolute(targetPath)){
            throw new Error('请传入新文件生成的绝对路径,参数-t')
        }

        targetPath = path.join(targetPath, 'steedos-app', 'main', 'default');
        mkdirsSync(targetPath);
        //测试新文件目标路径
        // targetPath = path.join("C:/clonefile/steedos-app-crm","steedos-app/main/default");

        await filesTolocalJson(steedosPackageJson, targetPath);
    }
}

ConvertCommand.flags = {
    oldFilesPath : convertOclif.flags.string({char: 'o', description: 'oldFilesPath', required: true}),
    targetPath : convertOclif.flags.string({char: 't', description: 'targetPath', required: true}),
}

module.exports = ConvertCommand