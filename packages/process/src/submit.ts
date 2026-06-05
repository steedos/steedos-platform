import { getObjectProcessDefinition, recordSubmit } from './process_manager'
import * as core from "express-serve-static-core";
import { SteedosError, sendError } from '@steedos/objectql'
import { getParam } from './request';
interface Request extends core.Request {
    user: any;
}

export const submit = async (req: Request, res: core.Response) => {
    try {
        const urlParams = req.params;
        const objectName = getParam(urlParams, 'objectName');
        const recordId = getParam(urlParams, 'record');
        const userSession = req.user;
        const body = req.body;
        const comment = body.comment;
        const approver = body.approver;
        
        const processDefinition = await getObjectProcessDefinition(objectName, recordId, userSession);
        if(!processDefinition){
            throw new SteedosError('process_approval_error_notFindProcessDefinition');
        }
        await recordSubmit(processDefinition._id, objectName, recordId, userSession, comment, approver);
        return res.status(200).send({state: 'SUCCESS'});
    } catch (error) {
        return sendError(res, error, 200)
    }
}
