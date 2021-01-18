import * as express from 'express';
import { getProcessInstanceWorkitem, processInstanceWorkitemApprove } from './process_manager'
import { allowApprover } from './permission_manager';
import * as core from "express-serve-static-core";
import { SteedosError, sendError } from '@steedos/objectql'

interface Request extends core.Request {
    user: any;
}

export const approve = async (req: Request, res: express.Response) => {
    try {
        const urlParams = req.params;
        // const objectName = urlParams.objectName;
        const instanceHistoryId = urlParams.record;
        const userSession = req.user;
        const body = req.body;
        const comment = body.comment;
        const approver = body.approver;
        if(await allowApprover(instanceHistoryId, userSession)){
            const workitem = await getProcessInstanceWorkitem(instanceHistoryId, userSession);
            await processInstanceWorkitemApprove(workitem._id, userSession, comment, approver);
            return res.status(200).send({state: 'SUCCESS'});
        }
        throw new SteedosError("process_approval_error_NoApproval");
    } catch (error) {
        return sendError(res, error, 200);
    }
}