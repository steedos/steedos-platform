import * as _ from "underscore";
import * as path from "path";
import * as objectql from "@steedos/objectql";
import { getMD5, JSONStringify, _TRIGGERKEYS } from "@steedos/objectql";
import { Action, Meta, Trigger, TriggerData } from "./types";
import { Context } from 'moleculer';

export async function load(broker: any, packagePath: string, packageServiceName: string) {
    let actions = {};
    let serviceName = `~triggers-${packageServiceName}`;
    let filePath = path.join(packagePath, "**");
    let objTriggers = objectql.loadObjectTriggers(filePath, packageServiceName);
    if (_.isEmpty(objTriggers)) {
        return;
    }
    for (const ot of objTriggers) {
        if (_.has(ot, 'handler')) { // 新trigger格式

            if (_.isString(ot.when)) {
                let action = generateAction(ot);
                if (action) {
                    actions[action.name] = action;
                }
            } else if (_.isArray(ot.when)) {
                for (const w of ot.when) {
                    let trigger = _.extend({}, ot, { when: w, name: undefined });
                    let action = generateAction(trigger);
                    if (action) {
                        actions[action.name] = action;
                    }
                }
            }
        }
    }

    let serviceConfig = {
        name: serviceName,
        actions: actions
    };
    let service = broker.createService(serviceConfig);
    if (!broker.started) {
        await broker._restartService(service)
    }

    await regist(broker, actions, serviceName, packageServiceName);
}

function generateAction(trigger: Trigger): Action {
    if (!_.contains(_TRIGGERKEYS, trigger.when)) {
        console.warn(`invalid value ${trigger.when}, please check your trigger.`);
        return;
    }

    let name = trigger.name || getMD5(JSONStringify(trigger));
    let action: Action = {
        trigger: {
            when: trigger.when,
            listenTo: trigger.listenTo,
            name: name
        },
        name: `${trigger.listenTo}.${name}`,
        handler: function () { }
    };
    if (_.has(trigger, 'handler')) {
        action.handler = function (ctx: Context) {
            trigger.handler.call(ctx.params, ctx);
        }
    }

    return action;
}


async function regist(broker: any, actions: object, serviceName: string, packageServiceName: string) {
    for (const key in actions) {
        if (Object.hasOwnProperty.call(actions, key)) {
            let action = actions[key];
            let data = generateAddData(action);
            let meta = generateAddMeta(broker, serviceName, packageServiceName);
            await broker.call('triggers.add', { data: data }, { meta: meta });
        }
    }
}


function generateAddData(action: Action): TriggerData {
    let data = {
        name: action.trigger.name,
        listenTo: action.trigger.listenTo,
        when: action.trigger.when,
        action: action.name
    };
    return data;
}


function generateAddMeta(broker: any, serviceName: string, packageServiceName): Meta {
    let meta = {
        metadataServiceName: packageServiceName,
        caller: {
            nodeID: broker.nodeID + '',
            service: {
                name: serviceName
            }
        }
    };
    return meta;
}
