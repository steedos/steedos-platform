import { loadFile, syncMatchFiles } from "@steedos/metadata-core";

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

const _WorkflowNotifications: any = {};
const _WorkflowRules: any = {};
const _ActionFieldUpdates: any = {};
const _OutboundMessages: any = {};

const addWorkflow = function(json){
    if(!json.name){
        throw new Error('missing attribute name');
    }
    if(json.notifications){
        for(let notification of json.notifications){
            if(!notification.name){
                throw new Error('missing attribute notification.name');
            }
            _WorkflowNotifications[notification.name] = Object.assign({}, notification, clone(BASERECORD), {type: "workflow_notifications", _id: notification.name});
        }
    }
    if(json.rules){
        for(let rule of json.rules){
            if(!rule.name){
                throw new Error('missing attribute rule.name');
            }
            _WorkflowRules[rule.name] = Object.assign({}, rule, clone(BASERECORD), {type: "workflow_rule", _id: rule.name});
        }
    }
    if(json.fieldUpdates){
        for(let fieldUpdate of json.fieldUpdates){
            if(!fieldUpdate.name){
                throw new Error('missing attribute fieldUpdate.name');
            }
            _ActionFieldUpdates[fieldUpdate.name] = Object.assign({}, fieldUpdate, clone(BASERECORD), {type: "action_field_updates", _id: fieldUpdate.name});
        }
    }
    if(json.outboundMessages){
        for(let outboundMessage of json.outboundMessages){
            if(!outboundMessage.name){
                throw new Error('missing attribute outboundMessage.name');
            }
            _OutboundMessages[outboundMessage.name] = Object.assign({}, outboundMessage, clone(BASERECORD), {type: "workflow_outbound_messages", _id: outboundMessage.name});
        }
    }
    
}

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

export const loadSourceWorkflows = function (filePath: string, serviceName: string){
    let workflows = loadWorkflows(filePath);
    workflows.forEach(element => {
        addWorkflow(element);
    });
}

export const getWorkflowNotifications = function(){
    return clone(_WorkflowNotifications) || [];
}

export const getWorkflowRules = function(){
    return clone(_WorkflowRules) || [];
}

export const getActionFieldUpdates = function(){
    return clone(_ActionFieldUpdates) || [];
}

export const getAllWorkflowNotifications = function(){
    let workflowNotifications = getWorkflowNotifications();
    return _.values(workflowNotifications);
}

export const getAllWorkflowRules = function(){
    let workflowRules = getWorkflowRules();
    return _.values(workflowRules);
}

export const getAllActionFieldUpdates = function(){
    let actionFieldUpdates = getActionFieldUpdates();
    return _.values(actionFieldUpdates);
}

export const getObjectWorkflowNotifications = function(objName){
    return _.where(getAllWorkflowNotifications(), {object_name: objName});
}

export const getObjectWorkflowRules = function(objName){
    return _.where(getAllWorkflowRules(), {object_name: objName});
}

export const getObjectActionFieldUpdates = function(objName){
    return _.where(getAllActionFieldUpdates(), {object_name: objName});
}

export const getWorkflowNotification = function(name){
    return _.find(getAllWorkflowNotifications(), function (item){
        return item.name === name
    });
}

export const getWorkflowRule = function(name){
    return _.find(getAllWorkflowRules(), function (item){
        return item.name === name
    });
}

export const getActionFieldUpdate = function(name){
    return _.find(getAllActionFieldUpdates(), function (item){
        return item.name === name
    });
}

// 出站消息
export const getWorkflowOutboundMessage = function(name){
    return _.find(getAllWorkflowOutboundMessages(), function (item){
        return item.name === name
    });
}

export const getWorkflowOutboundMessages = function(){
    return clone(_OutboundMessages) || [];
}

export const getAllWorkflowOutboundMessages = function(){
    let messages = getWorkflowOutboundMessages();
    return _.values(messages);
}

export const getObjectWorkflowOutboundMessages = function(objName){
    return _.where(getAllWorkflowOutboundMessages(), {object_name: objName});
}
