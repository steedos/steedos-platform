import { deleteCommonAttribute, sortAttribute } from '../../util/attributeUtil'
import { SteedosMetadataTypeInfoKeys as TypeInfoKeys, getFullName } from '@steedos/metadata-core';
import { getAllObject } from './object'

const _ = require('underscore')
const objectql = require('@steedos/objectql')

const process_definition = "process_definition";
const action_field_updates = "action_field_updates";
const workflow_notifications = "workflow_notifications";
const process_instance = "process_instance";
const process_node = "process_node";
const flow_roles = "flow_roles";
const roles = "roles";
const metadata_name = TypeInfoKeys.ApprovalProcess;

const nodes_changed_msg = 'Once an approval process has been activated, you cannot add or remove steps. '
+ 'Please create a new approval process from this one for modification. '
+ 'You may only delete an approval process that has no data records associated with it. '

export async function approvalProcessesFromDb(dbManager, approvalProcessList, steedosPackage){

    steedosPackage[metadata_name] = {}
    var packageApprovalProcesses = steedosPackage[metadata_name]

    if(approvalProcessList.length == 1 && approvalProcessList[0] == '*'){
        var dbApprovalProcesses = await getAllApprovalProcesses(dbManager);

        for(var i=0; i<dbApprovalProcesses.length; i++){
            var dbApprovalProcess = dbApprovalProcesses[i]
            var dbApprovalProcessName = getFullName(metadata_name, dbApprovalProcess)
            packageApprovalProcesses[dbApprovalProcessName] = dbApprovalProcess
        }

        steedosPackage[metadata_name] = packageApprovalProcesses;
    }else{

        for(var i=0; i<approvalProcessList.length; i++){
    
            var approvalProcessName = approvalProcessList[i];
       
            var approvalProcess = await getApprovalProcessByName(dbManager, approvalProcessName);
            if(!steedosPackage[metadata_name]){
                steedosPackage[metadata_name] = {}
            }
            steedosPackage[metadata_name][approvalProcessName] = approvalProcess;
        }
    }
}

async function getAllApprovalProcesses(dbManager) {

    var approvalProcesses = await dbManager.find(process_definition, {});
    for(var i=0; i<approvalProcesses.length; i++){
        let approvalProcess = approvalProcesses[i]
        await getProcessActionIds(dbManager, approvalProcess);
        await getProcessNodes(dbManager, approvalProcess);
        deleteCommonAttribute(approvalProcess);
        // sortAttribute(approvalProcess);
    }
    return approvalProcesses;
}

async function getApprovalProcessByName(dbManager, approvalProcessName) {

    var approvalProcess = await dbManager.findOne(process_definition, {name: approvalProcessName});
    await getProcessActionIds(dbManager, approvalProcess);
    await getProcessNodes(dbManager, approvalProcess);
    deleteCommonAttribute(approvalProcess);
    // sortAttribute(approvalProcess);
    return approvalProcess;
}

async function parseProcessActionNames(dbManager, approvalProcess) {
    // if(approvalProcess.initial_submission_updates_field_actions){
    //     for(let i=0; i<approvalProcess.initial_submission_updates_field_actions.length; i++){
    //         let fieldUpdateName = approvalProcess.initial_submission_updates_field_actions[i];
    //         let fieldUpdateId = await getFieldUpdateIdByName(dbManager, fieldUpdateName);
    //         approvalProcess.initial_submission_updates_field_actions[i] = fieldUpdateId;
    //     } 
    // }
    // if(approvalProcess.final_approval_updates_field_actions){
    //     for(let i=0; i<approvalProcess.final_approval_updates_field_actions.length; i++){
    //         let fieldUpdateName = approvalProcess.final_approval_updates_field_actions[i];
    //         let fieldUpdateId = await getFieldUpdateIdByName(dbManager, fieldUpdateName);
    //         approvalProcess.final_approval_updates_field_actions[i] = fieldUpdateId;
    //     } 
    // }
    // if(approvalProcess.final_rejection_updates_field_actions){
    //     for(let i=0; i<approvalProcess.final_rejection_updates_field_actions.length; i++){
    //         let fieldUpdateName = approvalProcess.final_rejection_updates_field_actions[i];
    //         let fieldUpdateId = await getFieldUpdateIdByName(dbManager, fieldUpdateName);
    //         approvalProcess.final_rejection_updates_field_actions[i] = fieldUpdateId;
    //     } 
    // }
    // if(approvalProcess.recall_updates_field_actions){
    //     for(let i=0; i<approvalProcess.recall_updates_field_actions.length; i++){
    //         let fieldUpdateName = approvalProcess.recall_updates_field_actions[i];
    //         let fieldUpdateId = await getFieldUpdateIdByName(dbManager, fieldUpdateName);
    //         approvalProcess.recall_updates_field_actions[i] = fieldUpdateId;
    //     } 
    // }
    
    // if(approvalProcess.initial_submission_workflow_notifications_actions){
    //     for(let i=0; i<approvalProcess.initial_submission_workflow_notifications_actions.length; i++){
    //         let workflowNotificationName = approvalProcess.initial_submission_workflow_notifications_actions[i];
    //         let workflowNotificationId = await getWorkflowNotificationIdByName(dbManager, workflowNotificationName);
    //         approvalProcess.initial_submission_workflow_notifications_actions[i] = workflowNotificationId;
    //     } 
    // }
    // if(approvalProcess.final_approval_workflow_notifications_actions){
    //     for(let i=0; i<approvalProcess.final_approval_workflow_notifications_actions.length; i++){
    //         let workflowNotificationName = approvalProcess.final_approval_workflow_notifications_actions[i];
    //         let workflowNotificationId = await getWorkflowNotificationIdByName(dbManager, workflowNotificationName);
    //         approvalProcess.final_approval_workflow_notifications_actions[i] = workflowNotificationId;
    //     } 
    // }
    // if(approvalProcess.final_rejection_workflow_notifications_actions){
    //     for(let i=0; i<approvalProcess.final_rejection_workflow_notifications_actions.length; i++){
    //         let workflowNotificationName = approvalProcess.final_rejection_workflow_notifications_actions[i];
    //         let workflowNotificationId = await getWorkflowNotificationIdByName(dbManager, workflowNotificationName);
    //         approvalProcess.final_rejection_workflow_notifications_actions[i] = workflowNotificationId;
    //     } 
    // }
    // if(approvalProcess.recall_workflow_notifications_actions){
    //     for(let i=0; i<approvalProcess.recall_workflow_notifications_actions.length; i++){
    //         let workflowNotificationName = approvalProcess.recall_workflow_notifications_actions[i];
    //         let workflowNotificationId = await getWorkflowNotificationIdByName(dbManager, workflowNotificationName);
    //         approvalProcess.recall_workflow_notifications_actions[i] = workflowNotificationId;
    //     } 
    // }
}
async function getProcessActionIds(dbManager, approvalProcess) {
    if(approvalProcess.initial_submission_updates_field_actions){
        for(let i=0; i<approvalProcess.initial_submission_updates_field_actions.length; i++){
            approvalProcess.initial_submission_updates_field_actions[i]
                = await getFieldUpdateNameById(dbManager, approvalProcess.initial_submission_updates_field_actions[i]);
        } 
    }
    if(approvalProcess.final_approval_updates_field_actions){
        for(let i=0; i<approvalProcess.final_approval_updates_field_actions.length; i++){
            approvalProcess.final_approval_updates_field_actions[i]
                = await getFieldUpdateNameById(dbManager, approvalProcess.final_approval_updates_field_actions[i]);
        } 
    }
    if(approvalProcess.final_rejection_updates_field_actions){
        for(let i=0; i<approvalProcess.final_rejection_updates_field_actions.length; i++){
            approvalProcess.final_rejection_updates_field_actions[i]
                = await getFieldUpdateNameById(dbManager, approvalProcess.final_rejection_updates_field_actions[i]);
        } 
    }
    if(approvalProcess.recall_updates_field_actions){
        for(let i=0; i<approvalProcess.recall_updates_field_actions.length; i++){
            approvalProcess.recall_updates_field_actions[i]
                = await getFieldUpdateNameById(dbManager, approvalProcess.recall_updates_field_actions[i]);
        } 
    }

    // 消息提醒现在直接保存的就是name，无需转换
    // 但需兼容旧数据
    if(approvalProcess.initial_submission_workflow_notifications_actions){
        for(let i=0; i<approvalProcess.initial_submission_workflow_notifications_actions.length; i++){
            approvalProcess.initial_submission_workflow_notifications_actions[i]
                = await getWorkflowNotificationNameById(dbManager, approvalProcess.initial_submission_workflow_notifications_actions[i]);
        } 
    }
    if(approvalProcess.final_approval_workflow_notifications_actions){
        for(let i=0; i<approvalProcess.final_approval_workflow_notifications_actions.length; i++){
            approvalProcess.final_approval_workflow_notifications_actions[i]
                = await getWorkflowNotificationNameById(dbManager, approvalProcess.final_approval_workflow_notifications_actions[i]);
        } 
    }
    if(approvalProcess.final_rejection_workflow_notifications_actions){
        for(let i=0; i<approvalProcess.final_rejection_workflow_notifications_actions.length; i++){
            approvalProcess.final_rejection_workflow_notifications_actions[i]
                = await getWorkflowNotificationNameById(dbManager, approvalProcess.final_rejection_workflow_notifications_actions[i]);
        } 
    }
    if(approvalProcess.recall_workflow_notifications_actions){
        for(let i=0; i<approvalProcess.recall_workflow_notifications_actions.length; i++){
            approvalProcess.recall_workflow_notifications_actions[i]
                = await getWorkflowNotificationNameById(dbManager, approvalProcess.recall_workflow_notifications_actions[i]);
        } 
    }
}

async function getWorkflowNotificationNameById(dbManager, workflowNotificationId) {
    var workflowNotification = await dbManager.findOne(workflow_notifications, {_id: workflowNotificationId});
    // delete workflowNotification._id;
    // deleteCommonAttribute(workflowNotification);

    //找得到就转换，找不到就原样返回
    if(workflowNotification){
        return workflowNotification.name;
    }else{
        return workflowNotificationId;
    }
}

async function getFieldUpdateNameById(dbManager, fieldUpdateId) {
    var actionFieldUpdate = await dbManager.findOne(action_field_updates, {_id: fieldUpdateId});
    // delete actionFieldUpdate._id;
    // deleteCommonAttribute(actionFieldUpdate);

    //找得到就转换，找不到就原样返回
    if(actionFieldUpdate){
        return actionFieldUpdate.name;
    }else{
        return fieldUpdateId;
    }
}

async function getProcessNodes(dbManager, approvalProcess) {

    var processNodes = await dbManager.find(process_node, {process_definition: approvalProcess._id});
    for(let processNode of processNodes){
        delete processNode._id;
        deleteCommonAttribute(processNode);
        // sortAttribute(processNode);

        // 岗位和角色 现在也直接保存的就是api_name，无需转换
        // if(processNode.assigned_approver_flow_roles){
        //     for(let i=0; i<processNode.assigned_approver_flow_roles.length; i++){
        //         var flowRole = await dbManager.findOne(flow_roles, {api_name: processNode.assigned_approver_flow_roles[i]})
        //         processNode.assigned_approver_flow_roles[i] = flowRole.name;
        //     }
        // }
        // if(processNode.assigned_approver_roles){
        //     for(let i=0; i<processNode.assigned_approver_roles.length; i++){
        //         var role = await dbManager.findOne(roles, {_id: processNode.assigned_approver_roles[i]})
        //         processNode.assigned_approver_roles[i] = role.name;
        //     }
        // }

        if(processNode.approval_updates_field_actions){
            for(let i=0; i<processNode.approval_updates_field_actions.length; i++){
                processNode.approval_updates_field_actions[i]
                    = await getFieldUpdateNameById(dbManager, processNode.approval_updates_field_actions[i]);
            } 
        }
        if(processNode.rejection_updates_field_actions){
            for(let i=0; i<processNode.rejection_updates_field_actions.length; i++){
                processNode.rejection_updates_field_actions[i]
                    = await getFieldUpdateNameById(dbManager, processNode.rejection_updates_field_actions[i]);
            } 
        }
        // 同上，不用转换
        // 但需要兼容旧数据
        if(processNode.approval_workflow_notifications_actions){
            for(let i=0; i<processNode.approval_workflow_notifications_actions.length; i++){
                processNode.approval_workflow_notifications_actions[i]
                    = await getWorkflowNotificationNameById(dbManager, processNode.approval_workflow_notifications_actions[i]);
            } 
        }
        if(processNode.rejection_workflow_notifications_actions){
            for(let i=0; i<processNode.rejection_workflow_notifications_actions.length; i++){
                processNode.rejection_workflow_notifications_actions[i]
                    = await getWorkflowNotificationNameById(dbManager, processNode.rejection_workflow_notifications_actions[i]);
            } 
        }

        delete processNode.assigned_approver_users;
        delete processNode.process_definition;
    }
    approvalProcess['process_nodes'] = processNodes;
}

export async function approvalProcessesToDb(dbManager, approvalProcesses){

    const nowTime = new Date().getTime();

    for(const approvalProcessName in approvalProcesses){
        var approvalProcess = approvalProcesses[approvalProcessName];

        var processNodes = approvalProcess.process_nodes
        delete approvalProcess.process_nodes;

        // await parseProcessActionNames(dbManager, approvalProcess);

        // approvalProcess.name = `pd_${nowTime}`;
        let dbProcess = await dbManager.findOne(process_definition, {name: approvalProcess.name});
        if(dbProcess){
            await dbManager.update(process_definition, {name: approvalProcess.name}, approvalProcess);
            approvalProcess._id = dbProcess._id;
        }else{
            dbProcess = await dbManager.findOne(process_definition, {name: approvalProcess.name}, false);
            if(dbProcess){
                throw new Error(`name of ApprovalProcess already exists: ${approvalProcess.name}`);
            }
            await dbManager.insert(process_definition, approvalProcess);
            // dbProcess = await dbManager.findOne(process_definition, {name: approvalProcess.name});

        }

        if(!processNodes){
            continue;
        }

        let nodeOrders = _.pluck(processNodes, 'order').sort();
        var invalidOrderNumber = _.find(nodeOrders, function(item , index, array){ 
            if(typeof item != 'number' || (index>0 && item == array[index-1]) ){
                return item;
            }
        });
        if(invalidOrderNumber){
            throw new Error(`The approval process has an invalid Step with order: ${invalidOrderNumber}`);
        }

        processNodes.sort((node1, node2) =>{
            return node1.order - node2.order;
        });

        for(let index=0; index<processNodes.length; index++){
            let node = processNodes[index]
            node.order = index+1;
            if (index != 0 && node.if_criteria_not_met === 'reject') {
                throw new Error('仅第一个步骤的不满足条件可以为拒绝记录');
            }
            if(index == 0){
                node.reject_behavior = 'reject_request'
            }
            isAPIName(node.name);

            if(!node.filtrad){
                await objectql.checkFormula(node.entry_criteria, approvalProcess.object_name);
            }
            if(index == processNodes.length-1){
                node.if_criteria_not_met = 'approve'
            }
        }

        let hasInstance = false;
        let processActive = false;
        if(dbProcess){
            let processInstances = await dbManager.find(process_instance, {process_definition: dbProcess._id});
            hasInstance = processInstances.length > 0;
            processActive = dbProcess.active;
        }
        if(processActive || hasInstance){
            let dbProcessNodes = await dbManager.find(process_node, {process_definition: dbProcess._id});
            if(dbProcessNodes.length != processNodes.length){
                throw new Error(nodes_changed_msg);
            }
        }

        for(let index = 0; index < processNodes.length; index++){
            let processNode = processNodes[index];
            processNode.process_definition = approvalProcess._id;

            // if(processNode.assigned_approver_flow_roles){
            //     for(let i=0; i<processNode.assigned_approver_flow_roles.length; i++){
            //         let flowRole = processNode.assigned_approver_flow_roles[i];
            //         let dbFlowRole = await dbManager.findOne(flow_roles, {name: flowRole});
            //         if(!dbFlowRole){
            //             throw new Error(`The approval process has an invalid FlowRole: ${flowRole}`);
            //         }
            //         processNode.assigned_approver_flow_roles[i] = dbFlowRole._id;
            //     }
            // }
            // if(processNode.assigned_approver_roles){
            //     for(let i=0; i<processNode.assigned_approver_roles.length; i++){
            //         let role = processNode.assigned_approver_roles[i];
            //         let dbRole = await dbManager.findOne(roles, {name: role});
            //         if(!dbRole){
            //             throw new Error(`The approval process has an invalid Role: ${role}`);
            //         }
            //         processNode.assigned_approver_roles[i] = dbRole._id;
            //     }
            // }
            
            // if(processNode.approval_updates_field_actions){
            //     for(let i=0; i<processNode.approval_updates_field_actions.length; i++){
            //         processNode.approval_updates_field_actions[i]
            //             = await getFieldUpdateIdByName(dbManager, processNode.approval_updates_field_actions[i]);
            //     } 
            // }
            // if(processNode.rejection_updates_field_actions){
            //     for(let i=0; i<processNode.rejection_updates_field_actions.length; i++){
            //         processNode.rejection_updates_field_actions[i]
            //             = await getFieldUpdateIdByName(dbManager, processNode.rejection_updates_field_actions[i]);
            //     } 
            // }
            
            // if(processNode.approval_workflow_notifications_actions){
            //     for(let i=0; i<processNode.approval_workflow_notifications_actions.length; i++){
            //         processNode.approval_workflow_notifications_actions[i]
            //             = await getWorkflowNotificationIdByName(dbManager, processNode.approval_workflow_notifications_actions[i]);
            //     } 
            // }
            // if(processNode.rejection_workflow_notifications_actions){
            //     for(let i=0; i<processNode.rejection_workflow_notifications_actions.length; i++){
            //         processNode.rejection_workflow_notifications_actions[i]
            //             = await getWorkflowNotificationIdByName(dbManager, processNode.rejection_workflow_notifications_actions[i]);
            //     } 
            // }

            // processNode.name = `pn_${nowTime}_${index}`;
            let dbNode = await dbManager.findOne(process_node, {name: processNode.name});

            if(processActive || hasInstance){
                if(!dbNode){
                    throw new Error(nodes_changed_msg);
                }
                var unAllowEditFields = ['process_definition', 'filtrad', 'entry_criteria', 'if_criteria_not_met', 'reject_behavior'];
                for(const propertyName of unAllowEditFields){
                    if(JSON.stringify(processNode[propertyName]) != JSON.stringify(dbNode[propertyName])){
                        throw new Error(nodes_changed_msg);
                    }
                }
            }
        }

        if(dbProcess){
            await dbManager.deleteMany(process_node, {process_definition: dbProcess._id});
        }
        for(let processNode of processNodes){
            let dbNode = await dbManager.find(process_node, {name: processNode.name});
            if(dbNode.length >0){
                throw new Error(`name of process node already exists:[${processNode.name}]`);
            }
            await dbManager.insert(process_node, processNode);
        }

    }
}

async function getFieldUpdateIdByName(dbManager, fieldUpdateName){

    let dbFieldUpdate = await dbManager.findOne(action_field_updates, {name: fieldUpdateName});
    if(dbFieldUpdate){
        return dbFieldUpdate._id;
    }else{
        throw new Error(`The approval process references the workflow action FieldUpdate ${fieldUpdateName}, which doesn't exist`)
    }
}

async function getWorkflowNotificationIdByName(dbManager, notificationName){

    let dbNotification = await dbManager.findOne(workflow_notifications, {name: notificationName});
    if(dbNotification){
        return dbNotification._id;
    }else{
        throw new Error(`The approval process references the workflow action Notification ${notificationName}, which doesn't exist`)
    }
}

const isAPIName = function(apiName){
    var reg = new RegExp('^[a-z]([a-z0-9]|_(?!_))*[a-z0-9]$');
    if(!reg.test(apiName)){
        throw new Error("API 名称只能包含小写字母、数字，必须以字母开头，不能以下划线字符结尾或包含两个连续的下划线字符");
    }
    if(apiName.length > 20){
        throw new Error("名称长度不能大于20个字符");
    }
    return true
}