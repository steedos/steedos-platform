/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-03-30 11:49:53
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-03-30 14:34:23
 * @Description: 
 */
import * as _ from "underscore";
import * as path from "path";
import { registerProcess } from "@steedos/objectql";
// import { Process } from "./types";
import { LoadProcessFile } from '@steedos/metadata-core';
const loadProcessFile = new LoadProcessFile();

export async function load(broker: any, packagePath: string, packageServiceName: string) {
    let filePath = path.join(packagePath, "**");
    let processes = loadProcessFile.load(filePath);
    if (_.isEmpty(processes)) {
        return;
    }
    console.log(processes);

    const data = [];
    for (const apiName in processes) {
        const process = processes[apiName];
        data.push(process);
    }
    if (data.length > 0) {
        await registerProcess.mregister(broker, packageServiceName, data)
    }

    // for (const wt of wTriggers) {

    //     if (_.isString(wt.listenTo)) {
    //         for (const when of ENUM_WHEN) {
    //             let handler = wt[when];
    //             if (!handler) {
    //                 continue;
    //             }
    //             let name = wt.name || getMD5(JSONStringify(wt));
    //             let config: Trigger = {
    //                 name: name,
    //                 "listenTo": wt.listenTo == '*' ? LISTENTO_ALL_FLOWS : wt.listenTo,
    //                 "when": when,
    //                 "handler": handler.toString()
    //             }
    //             await registerProcessTrigger.register(broker, packageServiceName, config);
    //         }

    //     }
    // }

}