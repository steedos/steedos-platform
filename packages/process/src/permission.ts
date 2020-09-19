import * as express from 'express';
import { getReocrdProcessInstance } from './process_manager'
import * as core from "express-serve-static-core";
import { allowRecall, allowApprover, allowSubmit } from './permission_manager';

interface Request extends core.Request {
    user: any;
}

export const allowRecallByProcessInstance = async (req: Request, res: express.Response) => {
    try {
        const urlParams = req.params;
        const objectName = urlParams.objectName;
        const recordId = urlParams.record;
        const userSession = req.user;
        const pendingInstances = await getReocrdProcessInstance(objectName, recordId, 'pending', userSession);
        if(pendingInstances.length > 0){
            const instanceId = pendingInstances[0]._id;
            if(await allowRecall(instanceId, userSession)){
                return res.status(200).send({allowRecall: true});
            }
        }
        return res.status(200).send({allowRecall: false});
    } catch (error) {
        return res.status(200).send({allowRecall: false});
    }
}

export const allowApproverByInstanceHistoryId = async (req: Request, res: express.Response) => {
    try {
        const urlParams = req.params;
        // const objectName = urlParams.objectName;
        const instanceHistoryId = urlParams.record;
        const userSession = req.user;
        if(await allowApprover(instanceHistoryId, userSession)){
            return res.status(200).send({allowApprover: true});
        }
        return res.status(200).send({allowApprover: false});
    } catch (error) {
        console.log(error);
        return res.status(200).send({allowApprover: false});
    }
}

export const allowObjectSubmit = async(req: Request, res: express.Response)=>{
    try {
        const urlParams = req.params;
        const objectName = urlParams.objectName;
        const recordId = urlParams.record;
        const userSession = req.user;
        if(await allowSubmit(objectName, recordId, userSession)){
            return res.status(200).send({allowSubmit: true});
        }
        return res.status(200).send({allowSubmit: false});
    } catch (error) {
        console.log('error', error);
        return res.status(200).send({allowSubmit: false});
    }
}