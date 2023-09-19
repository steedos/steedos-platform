/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-03-28 09:35:34
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-09-18 17:57:53
 * @Description: 
 */
import * as express from 'express';
import * as requestIp from 'request-ip';
import { AccountsServer, generateRandomToken } from '../../server';
import { getUserAgent } from '../utils/get-user-agent';
import { sendError } from '../utils/send-error';
import { setAuthCookies } from '../utils/steedos-auth';
import isMobile from 'ismobilejs';
import { getObject } from '@steedos/objectql';
import { db } from '../../db';
import { getFirstSpace } from './spaces';

export const login = (accountsServer: AccountsServer) => async (
  req: express.Request,
  res: express.Response
) => {
  let userAgent = getUserAgent(req) || '';
  const ip = requestIp.getClientIp(req);
  let status = 'success';
  let message = '';
  let result: any = null;
  try {
    result = await accountsServer.loginWithService('password', req.body, {
      ip,
      userAgent
    });
    if(result._next){
      return res.json(result);
    }

    setAuthCookies(req, res, result.user._id, result.token, result.tokens.accessToken);
    try {
      if(result && result.user){
        delete result.user['services']
      }
    } catch (error) {
      
    }
    res.json(result);
    return;
  } catch (err) {
    console.log(err)
    status = 'fail';
    message = err.message;
    sendError(res, {message: err.message});
  } finally {
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
      const space = await getFirstSpace(accountsServer);

      let remote_user = null;
      if(!result){
        let foundUser: any | null = await accountsServer.getServices()["password"].foundUser(req.body.user);
        remote_user = foundUser?foundUser._id:null
      }else{
        remote_user = result?.user?._id
      }

      if(space){
        // 记录登录日志, 不记录密码.
        const { password, ...data} = req.body;
        await getObject('operation_logs').insert({
          name: '登录',
          type: 'login',
          remote_user: remote_user,
          remote_addr: ip,
          http_user_agent: userAgent,
          is_mobile: is_phone,
          is_tablet,
          object: 'users',
          status: status,
          create: new Date(),
          space: space._id,
          message: message,
          data: JSON.stringify(data),
          related_to: {
            o: "users",
            ids: [remote_user]
          }
        })
      }
  }
}