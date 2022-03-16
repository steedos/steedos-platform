import * as _ from "underscore";
import * as path from "path";
import { getMD5, JSONStringify, loadWorkflowTriggers, registerWorkflowTrigger } from "@steedos/objectql";
import { Trigger } from "./types";

const ENUM_WHEN = ['beforeDraftInsert', 'afterDraftInsert', 'beforeDraftSubmit', 'afterDraftSubmit', 'beforeStepSubmit', 'afterStepSubmit', 'cacluateNextStepUsers',
    'beforeCancel', 'afterCancel', 'beforeTerminate', 'afterTerminate', 'beforeEnd', 'afterEnd'];

export async function load(broker: any, packagePath: string, packageServiceName: string) {
    let filePath = path.join(packagePath, "**");
    let wTriggers = loadWorkflowTriggers(filePath);
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
                    "listenTo": wt.listenTo,
                    "when": when,
                    "handler": handler.toString()
                }
                await registerWorkflowTrigger.register(broker, packageServiceName, config);
                console.log(await registerWorkflowTrigger.find(broker, { pattern: `${wt.listenTo}.${when}.*` }))
            }

        }
    }

}