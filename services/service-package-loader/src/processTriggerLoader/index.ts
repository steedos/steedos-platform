/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-05-16 11:55:06
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-05-30 09:47:15
 * @Description: 
 */
import * as _ from "underscore";
import * as path from "path";
import { getMD5, JSONStringify } from '@steedos/metadata-core';
import { Trigger } from "./types";
import { registerProcessTrigger, loadProcessTriggers } from "@steedos/metadata-registrar";

const ENUM_WHEN = ['beforeDraftInsert', 'afterDraftInsert', 'beforeDraftSubmit', 'afterDraftSubmit', 'beforeStepSubmit', 'afterStepSubmit', 'cacluateNextStepUsers',
    'beforeCancel', 'afterCancel', 'beforeTerminate', 'afterTerminate', 'beforeEnd', 'afterEnd'];
const LISTENTO_ALL_FLOWS = 'LISTENTO_ALL_FLOWS';

export async function load(broker: any, packagePath: string, packageServiceName: string) {
    let filePath = path.join(packagePath, "**");
    let wTriggers = loadProcessTriggers(filePath);
    if (_.isEmpty(wTriggers)) {
        return;
    }
    for (const wt of wTriggers) {

        if (_.isString(wt.listenTo)) {
            for (const when of ENUM_WHEN) {
                let handler = wt[when];
                if (!handler) {
                    continue;
                }
                let name = wt.name || getMD5(JSONStringify(wt));
                let config: Trigger = {
                    name: name,
                    "listenTo": wt.listenTo == '*' ? LISTENTO_ALL_FLOWS : wt.listenTo,
                    "when": when,
                    "handler": handler.toString()
                }
                await registerProcessTrigger.register(broker, packageServiceName, config);
            }

        }
    }

}