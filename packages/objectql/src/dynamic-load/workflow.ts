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
    if(json.notifications){
        for(let notification of json.notifications){
            if(!notification.name){
                throw new Error('missing attribute notification.name');
            }
            if(!_WorkflowNotifications[json.name]){
                _WorkflowNotifications[json.name] = [];
            }
            _WorkflowNotifications[json.name].push(Object.assign({}, notification, clone(BASERECORD), {type: "workflow_notifications", _id: `${json.name}.${notification.name}`}));
        }
    }
    if(json.rules){
        for(let rule of json.rules){
            if(!rule.name){
                throw new Error('missing attribute rule.name');
            }
            if(!_WorkflowRules[json.name]){
                _WorkflowRules[json.name] = [];
            }
            _WorkflowRules[json.name].push(Object.assign({}, rule, clone(BASERECORD), {type: "workflow_rule", _id: `${json.name}.${rule.name}`}));
        }
    }
    if(json.fieldUpdates){
        for(let fieldUpdate of json.fieldUpdates){
            if(!fieldUpdate.name){
                throw new Error('missing attribute fieldUpdate.name');
            }
            if(!_ActionFieldUpdates[json.name]){
                _ActionFieldUpdates[json.name] = [];
            }
            _ActionFieldUpdates[json.name].push(Object.assign({}, fieldUpdate, clone(BASERECORD), {type: "action_field_updates", _id: `${json.name}.${fieldUpdate.name}`}));
        }
    }
    
}

export const loadSourceWorkflows = function (filePath: string){
    let workflows = util.loadWorkflows(filePath);
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

    for(let objName in workflowNotifications){
        let notifications = workflowNotifications[objName];
        res = res.concat(notifications);
    }
    return res;
}

export const getAlltWorkflowRules = function(){
    let workflowRules = gettWorkflowRules();
    let res = [];

    for(let objName in workflowRules){
        let rules = workflowRules[objName];
        res = res.concat(rules);
    }
    return res;
}

export const getAllActionFieldUpdates = function(){
    let actionFieldUpdates = getActionFieldUpdates();
    let res = [];

    for(let objName in actionFieldUpdates){
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