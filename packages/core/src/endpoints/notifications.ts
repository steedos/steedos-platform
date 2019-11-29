
import * as express from 'express';
import { auth } from '@steedos/auth';
import { getSteedosSchema } from '@steedos/objectql';
import util from '../util';

export const read = async (req: express.Request, res: express.Response) => {
    let id = req.params.id;
    let userSession = await auth(req, res);
    if (userSession.userId) {
        let record = await getSteedosSchema().getObject("notifications").findOne(id, { fields: ['owner', 'is_read', 'related_to', 'space', 'url'] });
        if(!record){
            res.status(404).send({
                "error": "Validate Request -- Not Found",
                "success": false
            });
        }
        if(record.owner !== userSession.userId){
            res.status(401).send({
                "error": "Validate Request -- Missing Access",
                "success": false
            });
        }
        if(!record.related_to && !record.url){
            res.status(401).send({
                "error": "Validate Request -- Missing related_to or url",
                "success": false
            });
        }
        if(!record.is_read){
            await getSteedosSchema().getObject('notifications').update(id, { 'is_read': true })
        }
        let redirectUrl = record.url ? record.url : util.getObjectRecordUrl(record.related_to.o, record.related_to.ids[0], record.space);
        res.redirect(redirectUrl);
    }
    return res.status(401).send({
        "error": "Validate Request -- Missing X-Auth-Token",
        "success": false
    })
}