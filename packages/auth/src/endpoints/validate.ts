/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-11-21 09:01:42
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-03-19 12:10:39
 * @Description: 
 */

import { Request, Response } from 'express-serve-static-core';
import { auth } from '../session';
import { setAuthCookies, clearAuthCookies } from '../utils';
import { getSteedosSchema } from '@steedos/objectql';

export const validate = async (req: Request, res: Response) => {
    let utcOffset = req.body.utcOffset;
    let userSession = await auth(req, res);
    let spaceUser = await getSteedosSchema().getObject('space_users').find({filters: [['space', '=', userSession.spaceId], ['user', '=', userSession.userId], ['user_accepted', '=', true]]});
    if (userSession.userId) {
        if(spaceUser.length > 0){
            let user = await getSteedosSchema().getObject('users').findOne(userSession.userId, { fields: ['utcOffset','password_expired','lockout'] });
            if(user.lockout){
                clearAuthCookies(req, res)
            }else{
                setAuthCookies(req, res, userSession.userId, userSession.authToken, userSession.spaceId);
                if (!user.hasOwnProperty('utcOffset')) {
                    await getSteedosSchema().getObject('users').update(userSession.userId, { 'utcOffset': utcOffset })
                }
                return res.send(Object.assign({}, userSession, {password_expired: user.password_expired}));
            }
        }else{
            clearAuthCookies(req, res)
        }
    }
    clearAuthCookies(req, res);
    return res.status(401).send({
        "error": "Validate Request -- Missing X-Auth-Token",
        "instance": "1329598861",
        "success": false
    })
}