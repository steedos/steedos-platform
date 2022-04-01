/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-03-30 11:06:13
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-03-30 11:07:31
 * @Description: 
 */
import path from 'path';
import fs from 'fs';
import * as glob from 'glob';
import { SteedosMetadataTypeInfoKeys as TypeInfoKeys } from '../typeInfo';
import { BaseLoadMetadataFile } from "./_baseLoadFile";
export class LoadProcessFile extends BaseLoadMetadataFile{
    constructor(){
        super(TypeInfoKeys.Process);
    }

    load(filePath) {
        const processes = super.load(filePath);
    
        for (const apiName in processes) {
            const process = processes[apiName];
            delete process.__filename;
            // 加载对应的引擎元数据
            const engineFileName = `${apiName}.process.${process.engine}.${process.ext}`;
            const matchedPaths = glob.sync(path.join(filePath, this.metadataInfo.defaultDirectory, engineFileName));
            if (matchedPaths.length > 1) {
                throw new Error(`路径${filePath}下检测到多份元数据文件${engineFileName}，请检查。`);
            }
            const engineFilePath = matchedPaths[0];
            if (engineFilePath) {
                const engineFileContent = fs.readFileSync(engineFilePath);
                process.schema = engineFileContent.toString();
            }
        }

        return processes;
    }
}