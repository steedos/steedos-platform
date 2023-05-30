/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2021-08-30 12:06:41
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-05-27 15:10:22
 * @Description: 
 */
import { SteedosMetadataTypeInfoKeys as TypeInfoKeys } from '../typeInfo';
import { BaseLoadMetadataFile } from "./_baseLoadFile";
import path from 'path';
import fs from 'fs';
import * as glob from 'glob';
import { getMD5 } from '../util/match_files';

export class LoadPageFile extends BaseLoadMetadataFile {
    constructor() {
        super(TypeInfoKeys.Page);
    }

    load(filePath) {
        const pages = super.load(filePath);

        for (const apiName in pages) {
            const page = pages[apiName];
            const render_engine = page.render_engine;
            // 如果render_engine为空或者为redash，则不加载引擎元数据
            if (!render_engine || render_engine === 'redash') {
                continue;
            }
            // 加载对应的引擎元数据
            const engineFileName = `${apiName}.page.${render_engine}.json`;
            const matchedPaths = glob.sync(path.join(filePath, this.metadataInfo.defaultDirectory, engineFileName));
            if (matchedPaths.length > 1) {
                throw new Error(`路径${filePath}下检测到多份元数据文件${engineFileName}，请检查。`);
            }
            const engineFilePath = matchedPaths[0];
            if (engineFilePath) {
                const engineFileContent = fs.readFileSync(engineFilePath);
                page.schema = engineFileContent.toString();
            }
            // 如果pageAssignments为数组，则遍历pageAssignments，给每个assignment计算_id
            if (page.pageAssignments && page.pageAssignments.length > 0) {
                page.pageAssignments.forEach(assignment => {
                    assignment._id = `${apiName}.${getMD5(JSONStringify(assignment))}`;
                });
            }
            page.version = 1;
        }

        return pages;
    }
}

function JSONStringify(data) {
    return JSON.stringify(data, function (key, val) {
        if (typeof val === 'function') {
            return val + '';
        }
        return val;
    })
}