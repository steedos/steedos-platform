/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-03-30 11:49:53
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-03-30 21:34:47
 * @Description: 
 */
import * as _ from "underscore";
import * as path from "path";
import * as glob from 'glob';
import * as fs from 'fs';
import { registerProcess } from "@steedos/objectql";
import { Process } from "./types";
import { LoadProcessFile } from '@steedos/metadata-core';
const loadProcessFile = new LoadProcessFile();

export async function load(broker: any, packagePath: string, packageServiceName: string) {
    let filePath = path.join(packagePath, "**");
    let processes = loadProcessFile.load(filePath);
    if (_.isEmpty(processes)) {
        return;
    }

    const data = [];
    for (const apiName in processes) {
        const process: Process = processes[apiName];
        // 加载对应的引擎元数据
        const engineFileName = `${apiName}.process.${process.engine}.${process.ext}`;
        const matchedPaths = glob.sync(path.join(filePath, loadProcessFile.metadataInfo.defaultDirectory, engineFileName));
        if (matchedPaths.length > 1) {
            throw new Error(`路径${filePath}下检测到多份元数据文件${engineFileName}，请检查。`);
        }
        const engineFilePath = matchedPaths[0];
        if (engineFilePath) {
            const engineFileContent = fs.readFileSync(engineFilePath);
            process.schema = engineFileContent.toString();
        }
        data.push(process);
    }
    if (data.length > 0) {
        await registerProcess.mregister(broker, packageServiceName, data)
    }

}