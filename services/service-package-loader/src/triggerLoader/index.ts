import * as _ from "underscore";
import * as path from "path";
import * as objectql from "@steedos/objectql";
import { getMD5 } from "@steedos/objectql";
import { Action, Meta, Trigger } from "./types";
import { Context } from 'moleculer';

const ENUM_WHEN = ['before.find', 'before.insert', 'before.update', 'before.remove', 'after.find', 'after.count', 'after.findOne', 'after.insert', 'after.update', 'after.remove'];

export async function load(broker: any, packagePath?: string, packageServiceName?: string) {
    // 如果 packagePath packageServiceName 未传则不扫描，直接调用 objectql.getLazyLoadListeners 获取listensers
    console.log("packagePath : " + packagePath);
    let actions = {};
    let serviceName = `${packageServiceName}-triggers`;

    let filePath = path.join(packagePath, "**");

    let objTriggers = objectql.loadObjectTriggers(filePath);
    console.log('objTriggers: ');
    console.log(objTriggers);
    _.forEach(objTriggers, (l) => {
        if (_.has(l, 'handler')) { // 新trigger格式
            let action = generateAction(l);
            if (action) {
                actions[action.name] = action;
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

function generateAction(listener): Action {
    let whenForCheck = [];
    if (_.isString(listener.when)) {
        whenForCheck.push(listener.when);
    } else if (_.isArray(listener.when)) {
        whenForCheck = listener.when;
    }
    for (const w of whenForCheck) {
        if (!_.contains(ENUM_WHEN, w)) {
            console.warn(`invalid value ${listener.when}, please check your trigger.`);
            return;
        }
    }

    let name = listener.name || getMD5(JSON.stringify(listener));
    let action: Action = {
        trigger: {
            when: listener.when,
            listenTo: listener.listenTo,
            name: name
        },
        name: `$trigger.${listener.listenTo}.${name}`,
        handler: function () { }
    };
    if (_.has(listener, 'handler')) {
        action.handler = function (ctx: Context) {
            listener.handler.call(ctx.params, ctx);
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
