import { getProcessInstanceWorkitem, getReocrdProcessInstance, getObjectProcessDefinition } from './process_manager'
const objectql = require('@steedos/objectql');


export const allowSubmit = async (objectName: string, recordId: string, userSession: any)=>{
    const pendingInstances = await getReocrdProcessInstance(objectName, recordId, 'pending', userSession);
    if(pendingInstances.length > 0){
        return false;
    }else{
        const processDefinition = await getObjectProcessDefinition(objectName, recordId, userSession)
        if(processDefinition){
            //TODO 提交权限 https://help.salesforce.com/articleView?err=1&id=approvals_create_submitters.htm&type=5
            return true;
        }
    }

    return false;
}

//调回：对象管理员或者提交者
export const allowRecall = async (processInstanceId: string, userSession: any)=>{
    const processInstance = await objectql.getObject("process_instance").findOne(processInstanceId);

    const objectPermission = await objectql.getObject(processInstance.target_object.o).getUserObjectPermission(userSession);

    if(objectPermission.modifyAllRecords){
        return true;
    }

    if(processInstance.submitted_by != userSession.userId){
        return false;
    }

    const processDefinition = await objectql.getObject("process_definition").findOne(processInstance.process_definition);

    if(processDefinition.allow_recall){
        return true;
    }

    return false;
}

/**
 * 包括 批准、拒绝、重新分配
 * TODO 代理
 * TODO 对象管理员(对象权限为修改所有)可以处理所有的待审核请求
 */
export const allowApprover = async (instanceHistoryId: string, userSession: any)=>{
    const workitem = await getProcessInstanceWorkitem(instanceHistoryId, userSession);
    if(workitem && workitem._id){
        return true;
    }else{
        return false;
    }
}

// export const allowEditRecord = async (objectName, recordId, userSession: any)=>{
//     let processInstance = await objectql.getObject("process_instance").count({filters: [['target_object.o', '=', objectName],['target_object.ids', '=', recordId]]});
//     if(processInstance < 1){
//         return true;
//     }
// }