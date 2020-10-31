import * as express from 'express';
import { processInstanceWorkitemRemovebyInstance, getReocrdProcessInstance } from './process_manager'
import * as core from "express-serve-static-core";
import { allowRecall } from './permission_manager';
import { SteedosError, sendError } from '@steedos/objectql'
interface Request extends core.Request {
    user: any;
}

export const recall = async (req: Request, res: express.Response) => {
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
            const instanceId = pendingInstances[0]._id;
            if(await allowRecall(instanceId, userSession)){
                await processInstanceWorkitemRemovebyInstance(instanceId, userSession, comment);
                return res.status(200).send({state: 'SUCCESS'});
            }else{
                throw new SteedosError("process_approval_error_recall_NoPermission");
            }
        }else{
            throw new SteedosError("process_approval_error_NoApproval")
        }
        
    } catch (error) {
        return sendError(res, error, 200);
    }
}

