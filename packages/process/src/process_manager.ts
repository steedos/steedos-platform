import {runProcessAction, runProcessNodeAction} from './platform_action_manager';
import { sendNotifications } from './notifications';
import { SteedosError } from '@steedos/objectql'

const objectql = require('@steedos/objectql');
const Fiber = require('fibers');
const _ = require("underscore");

declare var getHandlersManager;

const lockObjectRecord = async (objectName, reocrdId)=>{
    await objectql.getObject(objectName).directUpdate(reocrdId, {locked: true});
}

const unlockObjectRecord = async (objectName, reocrdId)=>{
    await objectql.getObject(objectName).directUpdate(reocrdId, {locked: false});
}

const getProcessNodeApprover = async (instanceId: string, processNode: any, userSession: any, chooseApprover: any , isBack: boolean, record?:any)=>{
    let nodeApprover = [];

    if(isBack){
        const processInstanceNodes = await objectql.getObject("process_instance_node").find({filters: [['process_instance', '=', instanceId], ['process_node', '=', processNode._id]], sort: "created desc"});
        if(!_.isEmpty(processInstanceNodes)){
            const lastProcessInstanceNode = processInstanceNodes[0];
            const nodeHistroy = await objectql.getObject("process_instance_history").find({filters: ['process_instance_node', '=', lastProcessInstanceNode._id]})
            _.each(nodeHistroy, function(item){
                nodeApprover.push(item.original_actor);
            })
        }
    }else{
        let approver = processNode.approver;
        if(approver === 'auto_assign'){
    
            if(!_.isEmpty(processNode.assigned_approver_users)){
                nodeApprover = nodeApprover.concat(processNode.assigned_approver_users)
            }
    
            if (!_.isEmpty(processNode.assigned_approver_roles)) {
                for (const roleId of processNode.assigned_approver_roles) {
                    let dbRoles = await objectql.getObject("roles").find({filters: ['api_name', '=', roleId]});
                    if (dbRoles && dbRoles.length>0 && !_.isEmpty(dbRoles[0].users)) {
                        nodeApprover = nodeApprover.concat(dbRoles[0].users);
                    }else{
                        let role = await objectql.getObject('roles').findOne(roleId);
                        if (role && !_.isEmpty(role.users)) {
                            nodeApprover = nodeApprover.concat(role.users);
                        }
                    }
                }
            }

            if (!_.isEmpty(processNode.assigned_approver_flow_roles)) {
                let submitted_by = userSession.userId;
                let spaceId = userSession.spaceId;
                if (instanceId) {
                    let processInstance = await objectql.getObject("process_instance").findOne(instanceId);
                    submitted_by = processInstance.submitted_by;
                }
                let assigned_approver_flow_role_ids = [];
                let flowRoleKeys = processNode.assigned_approver_flow_roles;
                for(let flowRoleKey of flowRoleKeys){
                    let dbFlowRole;
                    let dbFlowRoles = await objectql.getObject("flow_roles").find({filters: ['api_name', '=', flowRoleKey]});
                    if(dbFlowRoles && dbFlowRoles.length == 1){
                        dbFlowRole = dbFlowRoles[0]
                    }else{
                        dbFlowRole = await objectql.getObject("flow_roles").findOne(flowRoleKey);
                    }
                    assigned_approver_flow_role_ids.push(dbFlowRole._id);
                }

                let handlers = await new Promise((resolve, reject) => {
                    Fiber(function () {
                        try {
                            let handlers = getHandlersManager.getHandlersByUserAndRoles(submitted_by, assigned_approver_flow_role_ids, spaceId);
                            resolve(handlers);
                        } catch (error) {
                            reject(error)
                        }
                    }).run()
                });
                nodeApprover = nodeApprover.concat(handlers);
            }
    
            if(!_.isEmpty(processNode.assigned_approver_user_field)){
                if(instanceId){
                    const processInstance = await objectql.getObject("process_instance").findOne(instanceId);
                    record = await objectql.getObject(processInstance.target_object.o).findOne(processInstance.target_object.ids[0]);
                }
                if(record){
                    _.each(processNode.assigned_approver_user_field, function(fieldName){
                        let fieldValue = record[fieldName];
                        if(_.isString(fieldValue)){
                            fieldValue = [fieldValue]
                        }
                        if(_.isArray(fieldValue)){
                            nodeApprover = nodeApprover.concat(fieldValue);
                        }
                    })
                }
            }
    
        }else if(approver === 'submitter_choose'){
            if(chooseApprover){
                if(_.isString(chooseApprover)){
                    return [chooseApprover];
                }else if(_.isArray(chooseApprover)){
                    return _.uniq(_.compact(chooseApprover));
                }else{
                    throw new SteedosError('process_approval_error_invalidChooseApprover');
                }
            }else{
                throw new SteedosError('process_approval_error_needToChooseApprover');
            }
        }
    }
    return _.uniq(_.compact(nodeApprover)); 
}

const getProcessNodes = async (processDefinitionId: string, spaceId: string)=>{
    return await objectql.getObject('process_node').find({filters: [['process_definition', '=', processDefinitionId]], sort: "order asc"});
}

const addInstanceHistory = async (spaceId: string, instanceId: string, status: string, comment: string, options: any, userSession)=>{
    let instance = await objectql.getObject("process_instance").findOne(instanceId);
    let name = '';
    if(options.nodeId){
        const node = await objectql.getObject("process_node").findOne(options.nodeId);
        if(node){
            name = node.label;
        }
    }

    let instanceHistory = await objectql.getObject("process_instance_history").insert({
        name: name,
        process_instance: instanceId,
        target_object: instance.target_object,
        step_status: status,
        original_actor: options.originalActor || options.actor, //TODO 根据规则处理
        actor: options.actor, //TODO 根据规则处理
        comments: comment,
        step_node: options.nodeId,
        process_instance_node: options.instanceNodeId,
        space: spaceId,
        created_by: userSession.userId
    });

    if(status === 'approved' || status === 'rejected'){
        await handleProcessInstance(instanceHistory.process_instance, status, userSession);
    }

    if(status === 'pending'){
        await sendNotifications(instance.created_by, options.actor, {instanceHistory, status, instance});
    }
}

const addInstanceNode = async  (instanceId: string, node: any, userSession: any, nodeApprover: any)=>{
    let nodeId = node._id;
    let nodeName = node.label;
    // const nodeApprover = await getProcessNodeApprover(instanceId, node, userSession, isBack); 
    const instanceNode = await objectql.getObject("process_instance_node").insert({
        process_instance: instanceId,
        process_node: nodeId,
        process_node_name: nodeName,
        node_status: 'pending',
        space: userSession.spaceId,
        created_by: userSession.userId
    })
    for (const actor of nodeApprover) {
        await addInstanceHistory(userSession.spaceId, instanceId, 'pending', null, {nodeId: nodeId, actor: actor, originalActor: actor, submitted_by: userSession.userId, instanceNodeId: instanceNode._id}, userSession);
    }
}

const getNextNode = async (nodes: any, index: number = 0, objectName: string, recordId: string, userSession: any)=>{
    let node = nodes[index];
    if(node){
        if(node.filtrad){
            return node;
        }else{
            const canEntry = await objectql.computeFormula(node.entry_criteria, objectName, recordId, userSession);
            if(canEntry){
                return node;
            }else{
                if(node.if_criteria_not_met === 'skip'){
                    return await getNextNode(nodes, index + 1, objectName, recordId, userSession)
                }else if(node.if_criteria_not_met === 'reject'){
                    return {to_final_rejection: true}
                }else if(node.if_criteria_not_met === 'approve'){
                    return {to_final_approval: true}
                }
            }
        }
    }
}

const toNextNode = async (instanceId: string, node: any, nextApprovers: any, userSession: any)=>{
    if(node){
        await addInstanceNode(instanceId, node, userSession, nextApprovers);
    }
}

//TODO nextApprovers
// const toNextNode = async (instanceId: string, comment: string, nodes: any, index: number = 0, objectName: string, recordId: string, userSession: any, nextApprovers?)=>{
//     let spaceId = userSession.spaceId;
//     let currentUserId = userSession.userId;
//     let node = nodes[index];
//     if(node){
//         if(node.filtrad){
//             await addInstanceNode(instanceId, node, userSession);
//         }else{
//             const canEntry = await objectql.computeFormula(node.entry_criteria, objectName, recordId, currentUserId, spaceId);
//             if(canEntry){
//                 await addInstanceNode(instanceId, node, userSession);
//             }else{
//                 if(node.if_criteria_not_met === 'skip'){
//                     await toNextNode(instanceId, comment, nodes, index + 1, objectName, recordId, userSession)
//                 }else{
//                     let options = {actor: currentUserId}
//                     if(node.if_criteria_not_met === 'reject'){
//                         await addInstanceHistory(userSession.spaceId, instanceId, "rejected", comment, options, userSession)
//                     }else if(node.if_criteria_not_met === 'approve'){
//                         // await addInstanceHistory(userSession.spaceId, instanceId, "approved", comment, options)
//                     }
//                 }
//             }
//         }
//     }
// }
const getPreviousNode = async (instanceId: string, currentNode: any, userSession: any)=>{
    const previousInstanceNodes = await objectql.getObject("process_instance_node").find({filters: [['process_instance', '=', instanceId], ['process_node', '!=', currentNode._id]], sort: 'created desc'});
    if(!_.isEmpty(previousInstanceNodes)){
        const previousInstanceNode = previousInstanceNodes[0];
        const previousNode = await objectql.getObject("process_node").findOne(previousInstanceNode.process_node);
        return previousNode;
    }else{
        throw new SteedosError('not find previous node')
    }
}

// const toPreviousNode = async (instanceId: string, currentNode: any, userSession: any)=>{
//     const previousInstanceNodes = await objectql.getObject("process_instance_node").find({filters: [['process_instance', '=', instanceId], ['process_node', '!=', currentNode._id]], sort: 'created desc'});
//     if(!_.isEmpty(previousInstanceNodes)){
//         const previousInstanceNode = previousInstanceNodes[0];
//         const previousNode = await objectql.getObject("process_node").findOne(previousInstanceNode.process_node)
//         await addInstanceNode(instanceId, previousNode, userSession, true);
//     }else{
//         throw new SteedosError('not find previous node')
//     }
// }

//TODO 处理提交权限
export const getObjectProcessDefinition = async (objectName: string, recordId: string, userSession: any)=>{
    let spaceId = userSession.spaceId;
    let processes = await objectql.getObject('process_definition').find({filters: [['object_name', '=', objectName], ['space', '=', spaceId], ['active', '=', true]], sort: "order asc"})
    if(processes.length < 1){
        return null;
    }
    let process = null;
    //计算符合条件的process_definition
    for (const _process of processes) {
        const canEntry = await objectql.computeFormula(_process.entry_criteria, objectName, recordId, userSession);
        if(canEntry){
            process = _process
            break;
        }   
    }
    return process;
}

export const recordSubmit = async (processDefinitionId: string, objectName: string, recordId, userSession: any, comment: string, chooseApprover: any)=>{

    const pendingInstanceCount = await objectql.getObject("process_instance").count({filters: [['target_object.o', '=', objectName],['target_object.ids', '=', recordId],['status', '=', 'pending']]});
    if(pendingInstanceCount > 0){
        throw new SteedosError('process_approval_error_processInstancePending');
    }

    const nodes = await getProcessNodes(processDefinitionId, userSession.spaceId);

    const nextNode = await getNextNode(nodes, 0, objectName, recordId, userSession);

    let to_final_rejection = false;
    let to_final_approval = false;

    if(nextNode.to_final_rejection){
        to_final_rejection = true;
    }else if(nextNode.to_final_approval){
        to_final_approval = true;
    }

    let approver = null;

    if(!to_final_rejection && !to_final_rejection){
        const record = await objectql.getObject(objectName).findOne(recordId);
        approver = await getProcessNodeApprover(null, nextNode, userSession, chooseApprover, false, record);
    }

    let instance = await objectql.getObject("process_instance").insert({
        process_definition: processDefinitionId,
        target_object: {
            "o" : objectName,
            "ids" : [recordId]
        },
        status: "pending",
        space: userSession.spaceId,
        submitted_by: userSession.userId,
        created_by: userSession.userId
    });

    await lockObjectRecord(objectName, recordId);

    await runProcessAction(processDefinitionId, 'initial_submission', recordId, userSession);

    await addInstanceHistory(userSession.spaceId, instance._id, "started", comment, {actor: userSession.userId}, userSession);
    
    if(to_final_rejection){
        let options = {actor: userSession.userId};
        await addInstanceHistory(userSession.spaceId, instance._id, "rejected", comment, options, userSession)
    }else if(to_final_approval){
        let options = {actor: userSession.userId};
        await addInstanceHistory(userSession.spaceId, instance._id, "approved", comment, options, userSession)
    }else{
        await toNextNode(instance._id, nextNode, approver, userSession);
    }
}

export const getReocrdProcessInstance = async(objectName: string, recordId: string, status: string, userSession: any)=>{
    let spaceId = userSession.spaceId;
    return await objectql.getObject("process_instance").find({filters: [['space', '=', spaceId], ['status', '=', status], ['target_object.o', '=', objectName], ['target_object.ids', '=', recordId]]});
}

export const getProcessInstanceWorkitem = async (instanceHistoryId: string, userSession: any)=>{
    let spaceId = userSession.spaceId;
    let userId = userSession.userId; //TODO 代理
    const workitme = await objectql.getObject("process_instance_history").find({filters: [['_id', '=', instanceHistoryId], ['step_status', '=', 'pending'], ['actor', '=', userId], ['space', '=', spaceId]]})
    if(workitme.length > 0){
        return workitme[0];
    }
}

const getProcessActionWhenByStatus = (processStatus: string)=>{
    let when = '';
    if(processStatus === 'approved'){
        when = 'final_approval';
    }else if(processStatus === 'rejected'){
        when = 'final_rejection';
    }else if(processStatus === 'removed'){
        when = 'recall';
    }
    return when;
}

const getProcessNodeActionWhenByStatus = (processStatus: string)=>{
    let when = '';
    if(processStatus === 'approved'){
        when = 'approval';
    }else if(processStatus === 'rejected'){
        when = 'rejection';
    }
    return when;
}

// export const getProcessInstanceWorkitem = async (objectName: string, recordId: string, userSession: any)=>{
//     let spaceId = userSession.spaceId;
//     let userId = userSession.userId; //TODO 代理
//     const instances = await objectql.getObject("process_instance").find({filters: [['space', '=', spaceId], ['status', '=', 'pending'], ['target_object.o', '=', objectName], ['target_object.ids', '=', recordId]]});
//     if(instances.length < 1){
//         return 
//     }
//     const instance = instances[0];
//     const workitme = await objectql.getObject("process_instance_history").find({filters: [['process_instance', '=', instance._id], ['step_status', '=', 'pending'], ['actor', '=', userId]]})
//     if(workitme.length > 0){
//         return workitme[0];
//     }
// }

//TODO 编写trigger 处理elapsed_time
const handleProcessInstance = async(instanceId: string, processStatus: string, userSession: any)=>{
    let otherPendingInstanceNodeCount = await objectql.getObject("process_instance_node").count({filters: [['process_instance', '=', instanceId], ['node_status', '=', 'pending']]});
    if(otherPendingInstanceNodeCount === 0){
        const pInstance = await objectql.getObject("process_instance").update(instanceId, {status: processStatus, completed_date: new Date(), last_actor: userSession.userId});
        if(processStatus === 'removed'){
            await unlockObjectRecord(pInstance.target_object.o, pInstance.target_object.ids[0]);
        }else{
            let process = await objectql.getObject("process_definition").findOne(pInstance.process_definition);
            if(processStatus === 'approved'){
                if(process.final_approval_record_lock === 'unlock'){
                    await unlockObjectRecord(pInstance.target_object.o, pInstance.target_object.ids[0]);
                }else{
                    await lockObjectRecord(pInstance.target_object.o, pInstance.target_object.ids[0]);
                }
                
            }else if(processStatus === 'rejected'){
                if(process.final_rejection_record_lock === 'unlock'){
                    await unlockObjectRecord(pInstance.target_object.o, pInstance.target_object.ids[0]);
                }else{
                    await lockObjectRecord(pInstance.target_object.o, pInstance.target_object.ids[0]);
                }
            }
        } 
        let when = getProcessActionWhenByStatus(processStatus);
        if(when){
            await runProcessAction(pInstance.process_definition, when, pInstance.target_object.ids[0], userSession);
        }
        if(['approved', 'rejected'].indexOf(processStatus) > -1){
            await sendNotifications(pInstance.created_by, pInstance.created_by, { status: processStatus, instance: pInstance});
        }
    }
}

const getCurrentInstanceNode = async(instanceId)=>{
    const pendingNodes = await objectql.getObject("process_instance_node").find({filters: [['process_instance', '=', instanceId], ['node_status', '=', 'pending']]});
    let currentNode = null;
    if(pendingNodes.length > 0){
        currentNode = pendingNodes[0];
    }
    return currentNode;
}

const getProcessInstance = async (instanceId)=>{
    return await objectql.getObject("process_instance").findOne(instanceId);
}

const getProcessNode = async(processNodeId: string)=>{
    return await objectql.getObject("process_node").findOne(processNodeId); 
}

//TODO 编写trigger 处理elapsed_time
const handleProcessInstanceNode = async(instanceId: string, currentInstanceNode, processStatus: string, nextNodeOptions: any, userSession: any)=>{
    let otherPendingInstanceHistoryCount = await objectql.getObject("process_instance_history").count({filters: [['process_instance', '=', instanceId], ['step_status', '=', 'pending']]})
    if(otherPendingInstanceHistoryCount === 0){
        let finalProcessStatus = processStatus;
        await objectql.getObject("process_instance_node").updateMany([['process_instance', '=', instanceId], ['node_status', '=', 'pending']], {node_status: processStatus, completed_date: new Date(), last_actor: userSession.userId})
        let when = getProcessNodeActionWhenByStatus(processStatus);
        if(when){
            const instance = await objectql.getObject("process_instance").findOne(instanceId);
            await runProcessNodeAction(currentInstanceNode.process_node, when, instance.target_object.ids[0], userSession);
        }

        if(nextNodeOptions){
            let to_final_rejection = false;
            let to_final_approval = false;
            if(nextNodeOptions.node.to_final_rejection){
                to_final_rejection = true;
                finalProcessStatus = 'rejected';
            }else if(nextNodeOptions.node.to_final_approval){
                to_final_approval = true;
                finalProcessStatus = 'approved';
            }
            if(to_final_rejection){
            }else if(to_final_approval){
            }else{
                await toNextNode(instanceId, nextNodeOptions.node, nextNodeOptions.approve, userSession);
            }
        }

        await handleProcessInstance(instanceId, finalProcessStatus, userSession);
    }
}

const getInstanceHistory = async(instanceHistoryId)=>{
    return await objectql.getObject("process_instance_history").findOne(instanceHistoryId)
}

const getPendingInstanceHistoryCount = async (instanceId: string)=>{
    return await objectql.getObject("process_instance_history").count({filters: [['process_instance', '=', instanceId], ['step_status', '=', 'pending']]});
}

const handleProcessInstanceWorkitem = async (currentInstanceNode, processStatus: string, instanceHistoryId: string, userSession: any, comment: string, nextNodeOptions?: string)=>{
    let instanceHistory = await getInstanceHistory(instanceHistoryId);
    if(processStatus === 'rejected' || processStatus === 'approved'){
        await objectql.getObject("process_instance_history").update(instanceHistoryId, {step_status: processStatus, comments: comment, actor: userSession.userId});
        let when_multiple_approvers = 'first_response';
        if(instanceHistory.step_node){
            let processNode = await objectql.getObject("process_node").findOne(instanceHistory.step_node);
            if(processNode && processNode.when_multiple_approvers){
                when_multiple_approvers = processNode.when_multiple_approvers;
            }
        }
        if(when_multiple_approvers === 'first_response' || (when_multiple_approvers === 'unanimous' && processStatus === 'rejected')){
            await objectql.getObject("process_instance_history").updateMany([['_id', '!=', instanceHistory._id], ['process_instance', '=', instanceHistory.process_instance], ['step_status', '=', 'pending']], {step_status: 'no_response'})
        }
    }

    await handleProcessInstanceNode(instanceHistory.process_instance, currentInstanceNode, processStatus, nextNodeOptions, userSession);
}

export const processInstanceWorkitemApprove = async (instanceHistoryId: string, userSession: any, comment: string, chooseApprover?: string)=>{
    let nextNodeOptions = null;
    let instanceHistory = await getInstanceHistory(instanceHistoryId);
    let instanceId = instanceHistory.process_instance;
    let currentInstanceNode = await getCurrentInstanceNode(instanceId);
    let instance = await getProcessInstance(instanceId);
    let currentProcessNode = await getProcessNode(instanceHistory.step_node);
    const nodes = await getProcessNodes(instance.process_definition, userSession.spaceId);
    const index = _.findIndex(nodes, function(item){return item._id === currentInstanceNode.process_node});
    if(currentProcessNode.when_multiple_approvers === 'first_response' || (await getPendingInstanceHistoryCount(instanceId)) < 2){
        let nextNode = await getNextNode(nodes, index + 1, instance.target_object.o, instance.target_object.ids[0], userSession);
    
        if(nextNode){
            nextNodeOptions = {}
            nextNodeOptions.node = nextNode;
            nextNodeOptions.approve = await getProcessNodeApprover(instanceId, nextNodeOptions.node, userSession, chooseApprover, false);
        }
    }
    await handleProcessInstanceWorkitem(currentInstanceNode, 'approved', instanceHistoryId, userSession, comment, nextNodeOptions);
}

export const processInstanceWorkitemReject = async (instanceHistoryId: string, userSession: any, comment: string)=>{
    let nextNodeOptions = null;
    let instanceHistory = await getInstanceHistory(instanceHistoryId);
    let instanceId = instanceHistory.process_instance;
    let currentInstanceNode = await getCurrentInstanceNode(instanceId);
    let currentProcessNode = await getProcessNode(instanceHistory.step_node);

    if(currentProcessNode.reject_behavior === 'back_to_previous'){
        nextNodeOptions = {}
        nextNodeOptions.node = await getPreviousNode(instanceId, currentProcessNode, userSession)
        nextNodeOptions.approve = await getProcessNodeApprover(instanceId, nextNodeOptions.node, userSession, null, true);
    }

    await handleProcessInstanceWorkitem(currentInstanceNode, 'rejected', instanceHistoryId, userSession, comment, nextNodeOptions);
}

export const processInstanceWorkitemReassign = async (instanceHistoryId: string, userSession: any, comment: string, chooseApprover: string)=>{
    if(_.isEmpty(chooseApprover)){
        throw new SteedosError('process_approval_error_reassign_approver_notFind');
    }
    if(!_.isString(chooseApprover)){
        throw new SteedosError('process_approval_error_reassign_approver_mustBeString');
    }

    const history = await objectql.getObject("process_instance_history").update(instanceHistoryId, {
        step_status: "reassigned",
        actor: chooseApprover,
        comments: comment
    })

    await addInstanceHistory(userSession.spaceId, history.process_instance, 'pending', null, {nodeId: history.step_node, actor: chooseApprover, originalActor: history.original_actor, submitted_by: userSession.userId}, userSession);
}


export const processInstanceWorkitemRemovebyInstance = async (instanceId: string, userSession: any, comment: string)=>{
    const processStatus = 'removed';
    await objectql.getObject("process_instance_history").updateMany([['process_instance', '=', instanceId], ['step_status', '=', 'pending']], {step_status: processStatus, comments: comment});
    await handleProcessInstanceNode(instanceId, null, processStatus, null, userSession);
}
