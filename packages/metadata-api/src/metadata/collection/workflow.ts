import { deleteCommonAttribute, sortAttribute } from '../../util/attributeUtil'
import { SteedosMetadataTypeInfoKeys as TypeInfoKeys, getFullName } from '@steedos/metadata-core';
import _ from 'underscore';
// import { getAllObject } from './object'

const action_field_updates = "action_field_updates";
const workflow_rule = "workflow_rule";
const workflow_notifications = "workflow_notifications";
const workflow_outbound_messages = "workflow_outbound_messages"
const metadata_name = TypeInfoKeys.Workflow;

export async function workflowsFromDb(dbManager, workflowList, steedosPackage){

    if(workflowList.length == 1 && workflowList[0] == '*'){
        var dbWorkflows = await getAllWorkflows(dbManager);
        steedosPackage[metadata_name] = dbWorkflows;
    }else{

        for(var i=0; i<workflowList.length; i++){
    
            var objectName = workflowList[i];
       
            var workflow = await getWorkflowByOjectName(dbManager, objectName);
            if(!steedosPackage[metadata_name]){
                steedosPackage[metadata_name] = {}
            }
            steedosPackage[metadata_name][objectName] = workflow;
        }
    }
}

async function getAllWorkflows(dbManager) {

    var workflows:any = {};

    // var objects = await getAllObject(dbManager);
    let objects:any = [];
    var workflowRules = await dbManager.find(workflow_rule, { });
    let actionFieldUpdates = await dbManager.find(action_field_updates, { }); 
    let workflowNotifications = await dbManager.find(workflow_notifications, { }); 
    let outboundMessages = await dbManager.find(workflow_outbound_messages, { }); 

    for(let item of workflowRules){
        if(!_.contains(objects, item.object_name)){
            objects.push(item.object_name);
        }
    }
    for(let item of actionFieldUpdates){
        if(!_.contains(objects, item.object_name)){
            objects.push(item.object_name);
        }
    }
    for(let item of workflowNotifications){
        if(!_.contains(objects, item.object_name)){
            objects.push(item.object_name);
        }
    }
    for(let item of outboundMessages){
        if(!_.contains(objects, item.object_name)){
            objects.push(item.object_name);
        }
    }

    for(var i=0; i<objects.length; i++){
        var objectName = objects[i];

        var workflow = await getWorkflowByOjectName(dbManager, objectName);
        if(workflow){
            workflows[objectName] = workflow;
        }
    }

    return workflows;
}

async function getWorkflowByOjectName(dbManager, objectName) {

    var workflowRules = await dbManager.find(workflow_rule, {object_name: objectName});
    var actionFieldUpdates = await dbManager.find(action_field_updates, {object_name: objectName});
    var workflowNotifications = await dbManager.find(workflow_notifications, {object_name: objectName});
    var outboundMessages = await dbManager.find(workflow_outbound_messages, {object_name: objectName});

    var workflow = {}

    for(var i=0; i<workflowRules.length; i++){
        let workflowRule = workflowRules[i];
        deleteCommonAttribute(workflowRule);
        delete workflowRule._id;
        sortAttribute(workflowRule);
    }
    
    for(var i=0; i<actionFieldUpdates.length; i++){
        let fieldUpdate = actionFieldUpdates[i];
        deleteCommonAttribute(fieldUpdate);
        delete fieldUpdate._id;
        sortAttribute(fieldUpdate);
    }

    for(var i=0; i<workflowNotifications.length; i++){
        let notification = workflowNotifications[i];

        delete notification.assigned_users;

        deleteCommonAttribute(notification);
        delete notification._id;
        sortAttribute(notification);
    }

    for(var i=0; i<outboundMessages.length; i++){
        let message = outboundMessages[i];

        delete message.user_to_send_as

        deleteCommonAttribute(message);
        delete message._id;
        sortAttribute(message);
    }

    workflow['rules'] = workflowRules
    workflow['fieldUpdates'] =actionFieldUpdates
    workflow['notifications'] =workflowNotifications
    workflow['outboundMessages'] = outboundMessages

    if(workflowRules.length == 0 && actionFieldUpdates.length == 0 && workflowNotifications.length == 0 && outboundMessages.length == 0){
        return undefined;
    }
    return workflow;
}


export async function workflowsToDb(dbManager, workflows){

    for(const workflowName in workflows){
        var workflow = workflows[workflowName];
        await saveOrUpdateWorkflow(dbManager, workflow, workflowName);
    }
}

async function saveOrUpdateWorkflow(dbManager, workflow, workflowName) {

    var workflowRules = workflow.rules;
    var actionFieldUpdates = workflow.fieldUpdates;
    var workflowNotifications = workflow.notifications;
    var outboundMessages = workflow.outboundMessages;

    for(var i=0; i<workflowRules.length; i++){
        
        var workflowRule = workflowRules[i];
        await saveOrUpdateWorkflowRule(dbManager, workflowRule, workflowName);
    }

    for(var i=0; i<actionFieldUpdates.length; i++){

        var actionFieldUpdate = actionFieldUpdates[i];
        await saveOrUpdateActionFieldUpdate(dbManager, actionFieldUpdate, workflowName);
    }

    for(var i=0; i<workflowNotifications.length; i++){

        var workflowNotification = workflowNotifications[i];
        await saveOrUpdateWorkflowNotification(dbManager, workflowNotification, workflowName);
    }

    for(var i=0; i<outboundMessages.length; i++){
        var message = outboundMessages[i];
        await saveOrUpdateWorkflowOutboundMessage(dbManager, message, workflowName);
    }

    for(var i=0; i<workflowRules.length; i++){
        
        var workflowRule = workflowRules[i];
        await updateWorkflowRule(dbManager, workflowRule, workflowName);
    }
    
}

async function updateWorkflowRule(dbManager, workflowRule, objectName) {

    var filter = {name: workflowRule.name, object_name: objectName};

    await dbManager.update(workflow_rule, filter, workflowRule);
}
async function saveOrUpdateWorkflowRule(dbManager, workflowRule, objectName) {

    var filter = {name: workflowRule.name, object_name: objectName};
    var dbWorkflowRule = await dbManager.findOne(workflow_rule, filter);

    if(dbWorkflowRule == null){
        return await dbManager.insert(workflow_rule, workflowRule);
    }else{
        return await dbManager.update(workflow_rule, filter, workflowRule);
    }
}

async function saveOrUpdateActionFieldUpdate(dbManager, actionFieldUpdate, objectName) {

    var filter = {name: actionFieldUpdate.name, object_name: objectName};
    var dbActionFieldUpdate = await dbManager.findOne(action_field_updates, filter);

    if(dbActionFieldUpdate == null){
        return await dbManager.insert(action_field_updates, actionFieldUpdate);
    }else{
        return await dbManager.update(action_field_updates, filter, actionFieldUpdate);
    }
}

async function saveOrUpdateWorkflowNotification(dbManager, workflowNotification, objectName) {

    var filter = {name: workflowNotification.name, object_name: objectName};
    var dbActionFieldUpdate = await dbManager.findOne(workflow_notifications, filter);

    if(dbActionFieldUpdate == null){
        return await dbManager.insert(workflow_notifications, workflowNotification);
    }else{
        return await dbManager.update(workflow_notifications, filter, workflowNotification);
    }
}

async function saveOrUpdateWorkflowOutboundMessage(dbManager, message, objectName) {

    var filter = {name: message.name, object_name: objectName};
    var dbActionFieldUpdate = await dbManager.findOne(workflow_outbound_messages, filter);

    if(dbActionFieldUpdate == null){
        return await dbManager.insert(workflow_outbound_messages, message);
    }else{
        return await dbManager.update(workflow_outbound_messages, filter, message);
    }
}