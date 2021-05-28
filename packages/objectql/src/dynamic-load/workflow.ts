import { Dictionary } from '@salesforce/ts-types';
const _ = require('underscore');
const clone = require('clone');
var util = require('../util');

const PERMISSIONS = {
    allowEdit: false,
    allowDelete: false,
    allowRead: true,
};

const BASERECORD = {
    is_system: true,
    record_permissions: PERMISSIONS
};

const _WorkflowNotifications: Dictionary<any> = {};
const _WorkflowRules: Dictionary<any> = {};
const _ActionFieldUpdates: Dictionary<any> = {};

const addWorkflow = function(json){
    if(!json.name){
        throw new Error('missing attribute name');
    }
    console.log('json', json);
    if(json.notifications){
        console.log('notifications', json.notifications);
        for(let notification of json.notifications){
            if(!notification.name){
                throw new Error('missing attribute notification.name');
            }
            _WorkflowNotifications[json.name]  = Object.assign({}, json, clone(BASERECORD), {type: "workflow_notifications", _id: json.name});
        }
    }
    if(json.rules){
        console.log('rules', json.rules);
        for(let rule of json.rules){
            if(!rule.name){
                throw new Error('missing attribute rule.name');
            }
            _WorkflowRules[json.name]  = Object.assign({}, json, clone(BASERECORD), {type: "workflow_rule", _id: json.name});
        }
    }
    if(json.fieldUpdates){
        console.log('fieldUpdates', json.fieldUpdates);
        for(let fieldUpdate of json.fieldUpdates){
            if(!fieldUpdate.name){
                throw new Error('missing attribute fieldUpdate.name');
            }
            _ActionFieldUpdates[json.name]  = Object.assign({}, json, clone(BASERECORD), {type: "action_field_updates", _id: json.name});
        }
    }
    
}

export const loadSourceWorkflows = function (filePath: string){
    console.log('loadSourceWorkflows');
    let workflows = util.loadWorkflows(filePath);
    console.log('workflows', workflows);
    workflows.forEach(element => {
        addWorkflow(element);
    });
}

export const getWorkflowNotifications = function(){
    return clone(_WorkflowNotifications) || [];
}

export const gettWorkflowRules = function(){
    return clone(_WorkflowRules) || [];
}

export const getActionFieldUpdates = function(){
    return clone(_ActionFieldUpdates) || [];
}

export const getAllWorkflowNotifications = function(){
    let workflowNotifications = getWorkflowNotifications();
    let res = [];

    for(let objName of workflowNotifications){
        let notifications = workflowNotifications[objName];
        res = res.concat(notifications);
    }
    return res;
}

export const getAlltWorkflowRules = function(){
    let workflowRules = gettWorkflowRules();
    let res = [];

    for(let objName of workflowRules){
        let rules = workflowRules[objName];
        res = res.concat(rules);
    }
    return res;
}

export const getAllActionFieldUpdates = function(){
    let actionFieldUpdates = getActionFieldUpdates();
    let res = [];

    for(let objName of actionFieldUpdates){
        let updates = actionFieldUpdates[objName];
        res = res.concat(updates);
    }
    return res;
}

export const getObjectWorkflowNotifications = function(objName){
    return getWorkflowNotifications()[objName];
}

export const getObjectWorkflowRules = function(objName){
    return gettWorkflowRules()[objName];
}

export const getObjectActionFieldUpdates = function(objName){
    return getActionFieldUpdates()[objName];
}

export const getObjectWorkflowNotification = function(objName, name){
    let objectWorkflowNotifications = getObjectWorkflowNotifications(objName)
    if(objectWorkflowNotifications){
        return _.find(objectWorkflowNotifications, function(notification){
            return notification.name === name
        })
    }
}

export const getObjectWorkflowRule = function(objName, name){
    let objectWorkflowRules = getObjectWorkflowRules(objName);
    if(objectWorkflowRules){
        return _.find(objectWorkflowRules, function(rule){
            return rule.name === name
        })
    }
}

export const getObjectActionFieldUpdate = function(objName, name){
    let objectActionFieldUpdates = getObjectActionFieldUpdates(objName)
    if(objectActionFieldUpdates){
        return _.find(objectActionFieldUpdates, function(fieldUpdate){
            return fieldUpdate.name === name
        })
    }
}