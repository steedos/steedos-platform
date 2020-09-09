import * as express from 'express';
import { getObjectProcessDefinition, recordSubmit } from './process_manager'
import * as core from "express-serve-static-core";

interface Request extends core.Request {
    user: any;
}

export const submit = async (req: Request, res: express.Response) => {
    try {
        const urlParams = req.params;
        const objectName = urlParams.objectName;
        const recordId = urlParams.record;
        const userSession = req.user;
        const body = req.body;
        const comment = body.comment;
        const approver = body.approver;
        
        const processDefinition = await getObjectProcessDefinition(objectName, recordId, userSession);

        await recordSubmit(processDefinition._id, objectName, recordId, userSession, comment, approver);

        return res.status(200).send({state: 'SUCCESS'});
    } catch (error) {
        console.log(error);
        return res.status(200).send({state: 'FAILURE', error: error.message});
    }
}