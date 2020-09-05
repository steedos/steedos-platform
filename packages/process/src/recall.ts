import * as express from 'express';
import { getProcessInstanceWorkitem, processInstanceWorkitemRemove, processInstanceWorkitemRemovebyInstance, getReocrdProcessInstance } from './process_manager'
import * as core from "express-serve-static-core";

interface Request extends core.Request {
    user: any;
}

export const recall = async (req: Request, res: express.Response) => {

    try {
        const urlParams = req.params;
        // const objectName = urlParams.objectName;
        const instanceHistoryId = urlParams.record;
        const userSession = req.user;
        const body = req.body;
        const comment = body.comment;

        const workitem = await getProcessInstanceWorkitem(instanceHistoryId, userSession);

        await processInstanceWorkitemRemove(workitem._id, userSession, comment);

        return res.status(200).send({state: 'SUCCESS'});
    } catch (error) {
        console.log(error);
        return res.status(200).send({state: 'FAILURE', error: error.message});
    }
}

export const recallByProcessInstance = async (req: Request, res: express.Response) => {

    try {
        const urlParams = req.params;
        const objectName = urlParams.objectName;
        const recordId = urlParams.record;
        const userSession = req.user;
        const body = req.body;
        const comment = body.comment;
        const pendingInstances = await getReocrdProcessInstance(objectName, recordId, 'pending', userSession);
        //TODO 权限处理：如果支持取回，则发起人可以取回；否则只有对象管理员(有编辑所有的权限)可以取回 ，考虑company级权限？
        if(pendingInstances.length > 0){
            await processInstanceWorkitemRemovebyInstance(pendingInstances[0]._id, userSession, comment);
            return res.status(200).send({state: 'SUCCESS'});
        }else{
            throw new Error("process_approval_error_recall_NoApproval")
        }
        
    } catch (error) {
        console.log(error);
        return res.status(200).send({state: 'FAILURE', error: error.message});
    }
}