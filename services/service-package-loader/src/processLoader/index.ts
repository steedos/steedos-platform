/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-03-30 11:49:53
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-04-19 15:36:41
 * @Description: 
 */
import * as _ from "underscore";
import * as path from "path";
import { registerProcess, getObject } from "@steedos/objectql";
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
        data.push(Object.assign(process, {
            is_system: true,
            record_permissions: {
                allowEdit: false,
                allowDelete: false,
                allowRead: true,
            }
        }));

    }
    if (data.length > 0) {
        await registerProcess.mregister(broker, packageServiceName, data)
    }

}

// 软件包中的process元数据直接加载到库中
export async function sendPackageProcessToDb(packagePath: string) {
    let filePath = path.join(packagePath, "**");
    let processes = loadProcessFile.load(filePath);

    if (_.isEmpty(processes)) {
        return;
    }

    const processObj = getObject('process');
    const processVersionsObj = getObject('process_versions');
    const spaceObj = getObject('spaces');
    const spaceDoc = (await spaceObj.find({}))[0];
    // 如果没有工作区信息则说明为空库，不加载
    if (!spaceDoc) {
        return;
    }
    const now = new Date();
    const ownerId = spaceDoc.owner;
    const baseInfo = {
        space: spaceDoc._id,
        owner: ownerId,
        created: now,
        modified: now,
        created_by: ownerId,
        modified_by: ownerId,
    }
    for (const apiName in processes) {
        const processCount = await processObj.count({ filters: [['name', '=', apiName]] });
        if (processCount > 0) {
            console.log(`process ${apiName} already exists`);
            continue;
        }
        const process: Process = processes[apiName];
        const processId = await processObj._makeNewID();
        let processDoc = {
            _id: processId,
            name: process.name,
            label: process.label,
            object_name: process.object_name,
            engine: process.engine,
            is_active: false,
            description: process.description || '',
            entry_criteria: process.entry_criteria || '',
            when: process.when || '',
            ext: process.ext || '',
            ...baseInfo
        };
        let processVersionDoc = {
            process: processId,
            is_active: false,
            description: process.description || '',
            entry_criteria: process.entry_criteria || '',
            when: process.when || '',
            schema: process.schema || '',
            version: 1,
            ...baseInfo
        };
        await processObj.directInsert(processDoc);
        await processVersionsObj.directInsert(processVersionDoc);
    }

}