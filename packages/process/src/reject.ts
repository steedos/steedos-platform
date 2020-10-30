import * as express from 'express';
import { getProcessInstanceWorkitem, processInstanceWorkitemReject } from './process_manager'
import { allowApprover } from './permission_manager';
import * as core from "express-serve-static-core";
import { SteedosError, sendError } from '@steedos/objectql'
interface Request extends core.Request {
    user: any;
}

export const reject = async (req: Request, res: express.Response) => {
    try {
        const urlParams = req.params;
        // const objectName = urlParams.objectName;
        const instanceHistoryId = urlParams.record;
        const userSession = req.user;
        const body = req.body;
        const comment = body.comment;
        if(await allowApprover(instanceHistoryId, userSession)){
            const workitem = await getProcessInstanceWorkitem(instanceHistoryId, userSession);
            await processInstanceWorkitemReject(workitem._id, userSession, comment);
            return res.status(200).send({state: 'SUCCESS'});
        }
        throw new SteedosError("process_approval_error_NoApproval");
    } catch (error) {
        return sendError(res, error, 200)
    }
}