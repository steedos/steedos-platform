/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-03-30 11:49:53
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-04-10 10:00:31
 * @Description: 
 */
import * as _ from "underscore";
import * as path from "path";
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