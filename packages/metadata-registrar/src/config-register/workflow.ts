import { loadFile, syncMatchFiles } from "@steedos/metadata-core";
import { registerWorkflowRules } from '../metadata-register/workflow';
const _ = require('underscore');
const clone = require('clone');
const path = require('path');

const PERMISSIONS = {
    allowEdit: false,
    allowDelete: false,
    allowRead: true,
};

const BASERECORD = {
    is_system: true,
    record_permissions: PERMISSIONS
};

// const _WorkflowNotifications: any = {};
// const _WorkflowRules: any = {};
// const _ActionFieldUpdates: any = {};
// const _OutboundMessages: any = {};

// const addWorkflow = function(json){
//     if(!json.name){
//         throw new Error('missing attribute name');
//     }
//     if(json.notifications){
//         for(let notification of json.notifications){
//             if(!notification.name){
//                 throw new Error('missing attribute notification.name');
//             }
//             _WorkflowNotifications[notification.name] = Object.assign({}, notification, clone(BASERECORD), {type: "workflow_notifications", _id: notification.name});
//         }
//     }
//     if(json.rules){
//         for(let rule of json.rules){
//             if(!rule.name){
//                 throw new Error('missing attribute rule.name');
//             }
//             _WorkflowRules[rule.name] = Object.assign({}, rule, clone(BASERECORD), {type: "workflow_rule", _id: rule.name});
//         }
//     }
//     if(json.fieldUpdates){
//         for(let fieldUpdate of json.fieldUpdates){
//             if(!fieldUpdate.name){
//                 throw new Error('missing attribute fieldUpdate.name');
//             }
//             _ActionFieldUpdates[fieldUpdate.name] = Object.assign({}, fieldUpdate, clone(BASERECORD), {type: "action_field_updates", _id: fieldUpdate.name});
//         }
//     }
//     if(json.outboundMessages){
//         for(let outboundMessage of json.outboundMessages){
//             if(!outboundMessage.name){
//                 throw new Error('missing attribute outboundMessage.name');
//             }
//             _OutboundMessages[outboundMessage.name] = Object.assign({}, outboundMessage, clone(BASERECORD), {type: "workflow_outbound_messages", _id: outboundMessage.name});
//         }
//     }
    
// }

const loadWorkflows = (filePath: string)=>{
    let results = []
    const filePatten = [
        path.join(filePath, "*.workflow.yml"),
        "!" + path.join(filePath, "node_modules"),
    ]
    const matchedPaths:[string] = syncMatchFiles(filePatten);
    _.each(matchedPaths, (matchedPath:string)=>{
        let json: any = loadFile(matchedPath);
        let names = path.basename(matchedPath).split('.');

        if(!json.name){
            json.name = names[0]
        }
        results.push(json)
    })
    return results
}

export const loadSourceWorkflows = async function (filePath: string, serviceName: string){
    let workflows = loadWorkflows(filePath);
    const data = [];
    for (const item of workflows) {
        data.push(Object.assign({}, item, clone(BASERECORD), {_id: `${item.object_name}.${item.name}`}))
    }
    if (data.length > 0) {
        await registerWorkflowRules.mregister(broker, serviceName, data)
    }
}

const getAllWorkflows = async ()=>{
    let result = [];
    const all = await registerWorkflowRules.getAll(broker);
    for(let item of all){
        result.push(item.metadata)
    }
    return result;
}

export const getWorkflowNotifications = async function(){
    // return clone(_WorkflowNotifications) || [];
    const _WorkflowNotifications = []
    const allWorkflows = await getAllWorkflows();
    for (const json of allWorkflows) {
        if(json.notifications){
            for(let notification of json.notifications){
                if(!notification.name){
                    throw new Error('missing attribute notification.name');
                }
                _WorkflowNotifications[notification.name] = Object.assign({}, notification, clone(BASERECORD), {type: "workflow_notifications", _id: notification.name});
            }
        }
    }
    return _WorkflowNotifications
}

export const getWorkflowRules = async function(){
    const _WorkflowRules = [];
    const allWorkflows = await getAllWorkflows();
    for (const json of allWorkflows) {
        if(json.rules){
            for(let rule of json.rules){
                if(!rule.name){
                    throw new Error('missing attribute rule.name');
                }
                _WorkflowRules[rule.name] = Object.assign({}, rule, clone(BASERECORD), {type: "workflow_rule", _id: rule.name});
            }
        }
    }
    return _WorkflowRules;
}

export const getActionFieldUpdates = async function(){
    const _ActionFieldUpdates = [];
    const allWorkflows = await getAllWorkflows();
    for (const json of allWorkflows) {
        if(json.fieldUpdates){
            for(let fieldUpdate of json.fieldUpdates){
                if(!fieldUpdate.name){
                    throw new Error('missing attribute fieldUpdate.name');
                }
                _ActionFieldUpdates[fieldUpdate.name] = Object.assign({}, fieldUpdate, clone(BASERECORD), {type: "action_field_updates", _id: fieldUpdate.name});
            }
        }
    }
    return _ActionFieldUpdates;
}

export const getAllWorkflowNotifications = async function(){
    let workflowNotifications = await getWorkflowNotifications();
    return _.values(workflowNotifications);
}

export const getAllWorkflowRules = async function(){
    let workflowRules = await getWorkflowRules();
    return _.values(workflowRules);
}

export const getAllActionFieldUpdates = async function(){
    let actionFieldUpdates = await getActionFieldUpdates();
    return _.values(actionFieldUpdates);
}

export const getObjectWorkflowNotifications = async function(objName){
    let data = await getAllWorkflowNotifications()
    return _.where(data, {object_name: objName});
}

export const getObjectWorkflowRules = async function(objName){
    const data = await getAllWorkflowRules();
    return _.where(data, {object_name: objName});
}

export const getObjectActionFieldUpdates = async function(objName){
    const data = await getAllActionFieldUpdates();
    return _.where(data, {object_name: objName});
}

export const getWorkflowNotification = async function(name){
    const data = await getAllWorkflowNotifications();
    return _.find(data, function (item){
        return item.name === name
    });
}

export const getWorkflowRule = async function(name){
    const data = await getAllWorkflowRules();
    return _.find(data, function (item){
        return item.name === name
    });
}

export const getActionFieldUpdate = async function(name){
    const data = await getAllActionFieldUpdates();
    return _.find(data, function (item){
        return item.name === name
    });
}

// 出站消息
export const getWorkflowOutboundMessage = async function(name){
    const data = await getAllWorkflowOutboundMessages();
    return _.find(data, function (item){
        return item.name === name
    });
}

export const getWorkflowOutboundMessages = async function(){
    const _OutboundMessages = [];
    const allWorkflows = await getAllWorkflows();
    for (const json of allWorkflows) {
        if(json.outboundMessages){
            for(let outboundMessage of json.outboundMessages){
                if(!outboundMessage.name){
                    throw new Error('missing attribute outboundMessage.name');
                }
                _OutboundMessages[outboundMessage.name] = Object.assign({}, outboundMessage, clone(BASERECORD), {type: "workflow_outbound_messages", _id: outboundMessage.name});
            }
        }
    }
    return _OutboundMessages;
}

export const getAllWorkflowOutboundMessages = async function(){
    let messages = await getWorkflowOutboundMessages();
    return _.values(messages);
}

export const getObjectWorkflowOutboundMessages = async function(objName){
    const data = await getAllWorkflowOutboundMessages();
    return _.where(data, {object_name: objName});
}
