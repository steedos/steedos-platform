const objectql = require('@steedos/objectql');
const Fiber = require('fibers');
const _ = require("underscore");

declare var Creator;
// declare var TAPi18n;

const sendNotifications = async (instanceHistory, from, to)=>{
    if(!to){
        return;
    }
    var instance = await objectql.getObject("process_instance").findOne(instanceHistory.process_instance);
    var fromUser =  await objectql.getObject("users").findOne(to);
    var relatedDoc = await objectql.getObject(instance.target_object.o).findOne(instance.target_object.ids[0]);
    let relatedDocName = relatedDoc.name; //TODO
    var notificationTitle = `${fromUser.name} 正在请求批准 ${relatedDocName}`;
    var notificationDoc = {
        name: notificationTitle,
        body: relatedDocName,
        related_to: {
            o: "process_instance_history",
            ids: [instanceHistory._id]
        },
        related_name: relatedDocName,
        from: null,
        space: instanceHistory.space
    };

    Fiber(function () {
        Creator.addNotifications(notificationDoc, null, [to]);
    }).run();
}

const getProcessNodeApprover = async (processNode: any, userSession: any)=>{
    let nodeApprover = [];
    let approver = processNode.approver;
    if(approver === 'auto_assign'){

        if(!_.isEmpty(processNode.assigned_approver_users)){
            nodeApprover = nodeApprover.concat(processNode.assigned_approver_users)
        }

        if(!_.isEmpty(processNode.assigned_approver_roles)){
            //TODO
        }

        if(!_.isEmpty(processNode.assigned_approver_flow_roles)){
            //TODO
        }

        if(!_.isEmpty(processNode.assigned_approver_user_field)){
            //TODO
        }

    }else{
        //TODO
    }
    return _.uniq(_.compact(nodeApprover));
}

const getProcessNodes = async (processDefinitionId: string, spaceId: string)=>{
    return await objectql.getObject('process_node').find({filters: [['process_definition', '=', processDefinitionId], ['space', '=', spaceId]], sort: "order asc"});
}

const addInstanceHistory = async (spaceId: string, instanceId: string, status: string, comments: string, options: any)=>{
    let instance = await objectql.getObject("process_instance").findOne(instanceId);
    let name = '';
    if(options.nodeId){
        const node = await objectql.getObject("process_node").findOne(options.nodeId);
        if(node){
            name = node.name;
        }
    }

    let instanceHistory = await objectql.getObject("process_instance_history").insert({
        name: name,
        process_instance: instanceId,
        target_object: instance.target_object,
        step_status: status,
        original_actor: options.originalActor || options.actor, //TODO 根据规则处理
        actor: options.actor, //TODO 根据规则处理
        comments: comments,
        step_node: options.nodeId,
        space: spaceId
    });

    if(status === 'approved' || status === 'rejected'){
        await objectql.getObject("process_instance").update(instanceId, {status: status, completed_date: new Date(), last_actor: options.actor})
    }

    if(status === 'pending'){
        await sendNotifications(instanceHistory, options.submitted_by, options.actor);
    }
}

const addInstanceNode = async  (instanceId: string, node: any, userSession: any)=>{
    let nodeId = node._id;
    let nodeName = node.name;
    await objectql.getObject("process_instance_node").insert({
        process_instance: instanceId,
        process_node: nodeId,
        process_node_name: nodeName,
        node_status: 'pending',
        space: userSession.spaceId,
    })
    const nodeApprover = await getProcessNodeApprover(node, userSession);
    for (const actor of nodeApprover) {
        await addInstanceHistory(userSession.spaceId, instanceId, 'pending', null, {nodeId: nodeId, actor: actor, originalActor: actor, submitted_by: userSession.userId});
    }
}

//TODO nextApprovers
const toNextNode = async (instanceId: string, comments: string, nodes: any, index: number = 0, objectName: string, recordId: string, userSession: any, nextApprovers?)=>{
    let spaceId = userSession.spaceId;
    let currentUserId = userSession.userId;
    let node = nodes[index];
    if(node){
        const canEntry = await objectql.computeFormula(node.entry_criteria, objectName, recordId, currentUserId, spaceId);
        if(canEntry){
            await addInstanceNode(instanceId, node, userSession); //TODO 支持驳回时自定计算处理人
        }else{
            if(node.if_criteria_not_met === 'skip'){
                await toNextNode(instanceId, comments, nodes, index + 1, objectName, recordId, userSession)
            }else{
                let options = {actor: currentUserId}
                if(node.if_criteria_not_met === 'approve'){
                    await addInstanceHistory(userSession.spaceId, instanceId, "approved", comments, options)
                }else if(node.if_criteria_not_met === 'reject'){
                    await addInstanceHistory(userSession.spaceId, instanceId, "rejected", comments, options)
                }else{
                    await addInstanceHistory(userSession.spaceId, instanceId, "rejected", comments, options)
                }
            }
        }
    }
}

//TODO 处理提交全
export const getObjectProcessDefinition = async (objectName: string, recordId: string, userSession: any)=>{
    let spaceId = userSession.spaceId;
    let currentUserId = userSession.userId;
    let processes = await objectql.getObject('process_definition').find({filters: [['object_name', '=', objectName], ['space', '=', spaceId], ['active', '=', true]], sort: "order asc"})
    if(processes.length < 1){
        return null;
    }
    let process = null;
    //计算符合条件的process_definition
    for (const _process of processes) {
        const canEntry = await objectql.computeFormula(_process.entry_criteria, objectName, recordId, currentUserId, spaceId);
        if(canEntry){
            process = _process
            break;
        }   
    }
    return process;
}

export const recordSubmit = async (processDefinitionId: string, objectName: string, recordId, userSession: any, comments: string, approver: string)=>{
    let instance = await objectql.getObject("process_instance").insert({
        // name: recordName,
        process_definition: processDefinitionId,
        target_object: {
            "o" : objectName,
            "ids" : [recordId]
        },
        status: "pending",
        space: userSession.spaceId,
        submitted_by: userSession.userId, //TODO 确认规则
    });
    await addInstanceHistory(userSession.spaceId, instance._id, "started", comments, {actor: userSession.userId});
    const nodes = await getProcessNodes(processDefinitionId, userSession.spaceId);
    await toNextNode(instance._id, comments, nodes, 0, objectName, recordId, userSession);
}

export const getProcessInstanceWorkitem = async (instanceHistoryId: string, userSession: any)=>{
    let spaceId = userSession.spaceId;
    let userId = userSession.userId; //TODO 代理
    const workitme = await objectql.getObject("process_instance_history").find({filters: [['_id', '=', instanceHistoryId], ['step_status', '=', 'pending'], ['actor', '=', userId], ['space', '=', spaceId]]})
    if(workitme.length > 0){
        return workitme[0];
    }
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
        await objectql.getObject("process_instance").update(instanceId, {status: processStatus, completed_date: new Date(), last_actor: userSession.userId}) 
    }
}

//TODO 编写trigger 处理elapsed_time
const handleProcessInstanceNode = async(instanceId: string, processStatus: string, userSession: any)=>{
    let otherPendingInstanceHistoryCount = await objectql.getObject("process_instance_history").count({filters: [['process_instance', '=', instanceId], ['step_status', '=', 'pending']]})
    if(otherPendingInstanceHistoryCount === 0){

        const pendingNodes = await objectql.getObject("process_instance_node").find({filters: [['process_instance', '=', instanceId], ['node_status', '=', 'pending']]});
        let pendingNode = null;
        if(pendingNodes.length > 0){
            pendingNode = pendingNodes[0];
        }

        await objectql.getObject("process_instance_node").updateMany([['process_instance', '=', instanceId], ['node_status', '=', 'pending']], {node_status: processStatus, completed_date: new Date(), last_actor: userSession.userId})
        
        const instance = await objectql.getObject("process_instance").findOne(instanceId);

        const nodes = await getProcessNodes(instance.process_definition, userSession.spaceId);

        let index = _.findIndex(nodes, function(item){return item._id === pendingNode.process_node});

        if(processStatus === 'rejected'){
            index = index - 1;
        }

        if(processStatus === 'approved'){
            index = index + 1;
        }

        if(processStatus === 'approved' || (processStatus === 'rejected' && pendingNode.reject_behavior === 'back_to_previous')){
            
            if(processStatus === 'rejected'){
                //TODO 支持驳回时自定计算处理人
            }
            await toNextNode(instanceId, null, nodes, index + 1, instance.target_object.o, instance.target_object.ids[0], userSession);
        }

        await handleProcessInstance(instanceId, processStatus, userSession);
    }
}


const handleProcessInstanceWorkitem = async (processStatus: string, instanceHistoryId: string, userSession: any, comments: string, approver?: string)=>{

    //TODO 处理下一步需要选人的情况，如果需要选择，则return;

    let instanceHistory = await objectql.getObject("process_instance_history").update(instanceHistoryId, {step_status: processStatus, comments: comments});
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

    await handleProcessInstanceNode(instanceHistory.process_instance, processStatus, userSession);
}

export const processInstanceWorkitemApprove = async (instanceHistoryId: string, userSession: any, comments: string, approver?: string)=>{
    await handleProcessInstanceWorkitem('approved', instanceHistoryId, userSession, comments, approver);
}

export const processInstanceWorkitemReject = async (instanceHistoryId: string, userSession: any, comments: string, approver?: string)=>{
    await handleProcessInstanceWorkitem('rejected', instanceHistoryId, userSession, comments, approver);
}