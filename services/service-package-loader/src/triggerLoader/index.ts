import * as _ from "underscore";
import * as path from "path";
import * as objectql from "@steedos/objectql";
import { getMD5 } from "@steedos/objectql";
import { Action, Meta, Trigger } from "./types";
import { Context } from 'moleculer';

const ENUM_WHEN = ['before.find', 'before.insert', 'before.update', 'before.delete', 'after.find', 'after.count', 'after.findOne', 'after.insert', 'after.update', 'after.delete', 'before.aggregate', 'after.aggregate'];

export async function load(broker: any, packagePath?: string, packageServiceName?: string) {
    // 如果 packagePath packageServiceName 未传则不扫描，直接调用 objectql.getLazyLoadListeners 获取listensers
    console.log("packagePath : " + packagePath);
    let actions = {};
    let serviceName = `${packageServiceName}-triggers`;

    let filePath = path.join(packagePath, "**");

    let objTriggers = objectql.loadObjectTriggers(filePath);
    console.log('objTriggers: ');
    console.log(objTriggers);
    _.forEach(objTriggers, (ot) => {
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

    });

    let service = {
        name: serviceName,
        actions: actions,
    };
    broker.createService(service);

    await regist(broker, actions, serviceName);
}

function generateAction(trigger): Action {
    if (!_.contains(ENUM_WHEN, trigger.when)) {
        console.warn(`invalid value ${trigger.when}, please check your trigger.`);
        return;
    }

    let name = trigger.name || getMD5(JSON.stringify(trigger));
    let action: Action = {
        trigger: {
            when: trigger.when,
            listenTo: trigger.listenTo,
            name: name
        },
        name: `$trigger.${trigger.listenTo}.${name}`,
        handler: function () { }
    };
    if (_.has(trigger, 'handler')) {
        action.handler = function (ctx: Context) {
            trigger.handler.call(ctx.params, ctx);
        }
    }

    return action;
}


async function regist(broker: any, actions: object, serviceName: string) {
    for (const key in actions) {
        if (Object.hasOwnProperty.call(actions, key)) {
            let action = actions[key];
            let data = generateAddData(action);
            let meta = generateAddMeta(broker, serviceName);
            await broker.call('triggers.add', { data: data }, { meta: meta });
        }
    }
}


function generateAddData(action: Action): Trigger {
    let data = {
        name: action.trigger.name,
        listenTo: action.trigger.listenTo,
        when: action.trigger.when,
        action: action.name
    };
    return data;
}


function generateAddMeta(broker: any, serviceName: string): Meta {
    let meta = {
        caller: {
            nodeID: broker.nodeID + '',
            service: {
                name: serviceName
            }
        }
    };
    return meta;
}
