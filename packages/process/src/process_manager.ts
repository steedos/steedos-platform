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
        console.log('addNotifications', notificationDoc, null, [to]);
        Creator.addNotifications(notificationDoc, null, [to]);
    }).run();
}

const getProcessNodeApprover = async (processNode: any, userSession: any)=>{
    let nodeApprover = [];
    let approver = processNode.approver;
    if(approver === 'auto_approver'){
        _.each(processNode.auto_approver, function(item){
            if(item.type === 'user'){
                nodeApprover.push(item.value)
            }else{
                //TODO
            }
        })
    }else{
        //TODO
    }
    return nodeApprover;
}

const getProcessNodes = async (processDefinitionId: string, spaceId: string)=>{
    return await objectql.getObject('process_node').find({filters: [['process_definition', '=', processDefinitionId], ['space', '=', spaceId]], sort: "order asc"});
}

const addInstanceHistory = async (spaceId: string, instanceId: string, status: string, comments: string, options: any)=>{
    let instanceHistory = await objectql.getObject("process_instance_history").insert({
        // name: recordName, //TODO Approval Request Submitted
        process_instance: instanceId,
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
    let instanceNode = await objectql.getObject("process_instance_node").insert({
        process_instance: instanceId,
        process_node: nodeId,
        process_node_name: nodeName,
        node_status: 'pending',
        space: userSession.spaceId,
    })
    const nodeApprover = await getProcessNodeApprover(node, userSession);
    for (const actor of nodeApprover) {
        await addInstanceHistory(userSession.spaceId, instanceId, 'pending', null, {nodeId: instanceNode._id, actor: actor, originalActor: actor, submitted_by: userSession.userId});
    }
}

const toNextNode = async (instanceId: string, comments: string, nodes: any, index: number = 0, objectName: string, recordId: string, userSession: any)=>{
    let spaceId = userSession.spaceId;
    let currentUserId = userSession.userId;
    let node = nodes[index];
    const canEntry = await objectql.computeFormula(node.filtercriteria, objectName, recordId, currentUserId, spaceId);
    if(canEntry){
        // insert instance node && insert instance history
        await addInstanceNode(instanceId, node, userSession)
    }else{
        if(node.critrad === 'skip'){
            await toNextNode(instanceId, comments, nodes, index + 1, objectName, recordId, userSession)
        }else{
            let options = {actor: currentUserId}
            if(node.critrad === 'approve'){
                await addInstanceHistory(userSession.spaceId, instanceId, "approved", comments, options)
            }else if(node.critrad === 'reject'){
                await addInstanceHistory(userSession.spaceId, instanceId, "rejected", comments, options)
            }else{
                await addInstanceHistory(userSession.spaceId, instanceId, "rejected", comments, options)
            }
        }
    }
}

export const getObjectProcessDefinition = async (objectName: string, recordId: string, userSession: any)=>{
    let spaceId = userSession.spaceId;
    let currentUserId = userSession.userId;
    let processes = await objectql.getObject('process_definition').find({filters: [['object_name', '=', objectName], ['space', '=', spaceId], ['state', '=', 'active']], sort: "order asc"})
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