
import * as express from 'express';
import { auth } from '../session';
import { setAuthCookies, clearAuthCookies } from '../utils';
import { getSteedosSchema } from '@steedos/objectql';

export const validate = async (req: express.Request, res: express.Response) => {
    let utcOffset = req.body.utcOffset;
    let userSession = await auth(req, res);
    if (userSession.userId) {
        let spaceUser = await getSteedosSchema().getObject('space_users').find({filters: [['space', '=', userSession.spaceId], ['user', '=', userSession.userId], ['user_accepted', '=', true]]});
        if(spaceUser.length > 0){
            setAuthCookies(req, res, userSession.userId, userSession.authToken, userSession.spaceId);

            let user = await getSteedosSchema().getObject('users').findOne(userSession.userId, { fields: ['utcOffset','password_expired'] });
    
            if (!user.hasOwnProperty('utcOffset')) {
                await getSteedosSchema().getObject('users').update(userSession.userId, { 'utcOffset': utcOffset })
            }
    
            return res.send(Object.assign({}, userSession, {password_expired: user.password_expired}));
        }else{
            clearAuthCookies(req, res)
        }
    }
    return res.status(401).send({
        "error": "Validate Request -- Missing X-Auth-Token",
        "instance": "1329598861",
        "success": false
    })
}