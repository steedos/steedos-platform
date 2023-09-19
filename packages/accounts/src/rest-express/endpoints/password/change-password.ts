/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-05-19 11:38:30
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-09-18 17:58:22
 * @Description: 
 */
import * as express from 'express';
import { AccountsServer } from '../../../server';
import { sendError } from '../../utils/send-error';
import { getSteedosConfig, getObject } from '@steedos/objectql'
import { hashPassword } from '../../../password/utils';

import * as requestIp from 'request-ip';
import { getUserAgent } from '../../utils/get-user-agent';
import isMobile from "ismobilejs";
import { db } from '../../../db';

const config = getSteedosConfig();
declare var Creator;

export const changePassword = (accountsServer: AccountsServer) => async (
  req: express.Request,
  res: express.Response
) => {
  try {
    if (!(req as any).userId) {
      res.status(401);
      res.json({ message: 'Unauthorized' });
      return;
    }
    // oldPassword 、newPassword 已经是 sha256之后的
    const { oldPassword, newPassword } = req.body;

    // let passworPolicy = ((config as any).password || {}).policy

    // if(passworPolicy){
    //   if(!(new RegExp(passworPolicy)).test(newPassword || '')){
    //       sendError(res, new Error((config as any).password.policyError));
    //       return;
    //   }
    // }
    
    const password: any = accountsServer.getServices().password;

    await password.changePassword((req as any).userId, oldPassword, newPassword);
    password.db.collection.updateOne({_id: (req as any).userId}, {$set: {password_expired: false}})
    try {
      Creator.getCollection('space_users').update({user: (req as any).userId}, {$set: {password_expired: false}}, {
        multi: true
      })

      const userAgent = getUserAgent(req);
      const ip = requestIp.getClientIp(req);
      let is_phone = false;
      let is_tablet = false;
      if (userAgent) {
        try {
          const { phone, tablet } = isMobile(userAgent);
          is_phone = phone;
          is_tablet = tablet;
        } catch (Exception) {
          console.log(`Exception`, Exception);
        }
      }

      const userSpaces = await db.find("space_users", {
        filters: [["user", "=", (req as any).userId],["user_accepted", "=", true]],
        fields: ["space"],
      });

      if(userSpaces && userSpaces.length > 0){
        for (let userSpace of userSpaces) {
          const userId = (req as any).userId
          await getObject('operation_logs').insert({
            name: '修改密码',
            type: 'change_password',
            remote_user: userId,
            remote_addr: ip,
            http_user_agent: userAgent,
            is_mobile: is_phone,
            is_tablet,
            object: 'users',
            status: 'success',
            create: new Date(),
            create_by: userId,
            modified_by: userId,
            space: userSpace.space,
            related_to: {
              o: "users",
              ids: [userId]
            }
          })
        }
      }
    } catch (error) {
      console.log('error', error);
    }
    res.json({userId: (req as any).userId, password_expired: false});
  } catch (err) {
    sendError(res, err);
  }
};
