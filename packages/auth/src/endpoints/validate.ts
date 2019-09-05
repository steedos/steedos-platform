
import * as express from 'express';
import { auth } from '../session';
import { setAuthCookies } from '../utils';
import { getSteedosSchema } from '@steedos/objectql';

export const validate = async (req: express.Request, res: express.Response) => {
    let utcOffset = req.body.utcOffset;
    let userSession = await auth(req, res);
    if (userSession.userId) {
        setAuthCookies(req, res, userSession.userId, userSession.authToken, userSession.spaceId);

        let user = await getSteedosSchema().getObject('users').findOne(userSession.userId, { fields: ['utcOffset'] });

        if (!user.hasOwnProperty('utcOffset')) {
            await getSteedosSchema().getObject('users').update(userSession.userId, { 'utcOffset': utcOffset })
        }

        return res.send(userSession);
    }
    return res.status(401).send({
        "error": "Validate Request -- Missing X-Auth-Token",
        "instance": "1329598861",
        "success": false
    })
}