import _ from "underscore";
import * as path from "path";
import * as objectql from "@steedos/objectql";
import { getMD5 } from "@steedos/objectql";
import { Action, Meta, Trigger } from "./types";
import { Context } from 'moleculer';

export async function load(broker: any, packagePath: string, packageServiceName: string) {
    console.log("packagePath : " + packagePath);
    let actions = {};
    let serviceName = `${packageServiceName}-triggers`;

    let filePath = path.join(packagePath, "**");
    objectql.loadObjectTriggers(filePath);

    let objListeners = objectql.getLazyLoadListeners();
    console.log(objListeners);

    _.each(objListeners, (listeners, objectName) => {
        _.forEach(listeners, (l) => {
            let action = generateAction(l);
            actions[action.name] = action;
        });
    });
    console.log(actions);

    let service = {
        name: serviceName,
        actions: actions,
    };
    broker.createService(service);

    await regist(broker, actions, serviceName);

}

function generateAction(listener): Action {
    let name = listener.name || getMD5(JSON.stringify(listener));
    let action = {
        trigger: {
            when: listener.when, // TODO check when value
            listenTo: listener.listenTo,
            name: name
        },
        name: `$trigger.${listener.listenTo}.${name}`,
        handler: function (ctx: Context) {
            listener.handler.call({}, ctx);
        }
    };

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
        Action: action.name
    };
    return data;
}


function generateAddMeta(broker: any, serviceName: string): Meta {
    let meta = {
        caller: {
            nodeID: broker.nodeId + '',
            service: {
                name: serviceName
            }
        }
    };
    return meta;
}
