/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-03-28 09:35:34
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-09-19 09:23:20
 * @Description: 
 */
import * as express from 'express';
import { get, isEmpty, map } from 'lodash';
import { AccountsServer } from '../../server';
import { sendError } from '../utils/send-error';
import { clearAuthCookies } from '../utils/steedos-auth';
import { getObject } from '@steedos/objectql';
import * as requestIp from 'request-ip';
import { getUserAgent } from '../utils/get-user-agent';
import isMobile from 'ismobilejs';
export const logout = (accountsServer: AccountsServer) => async (
  req: express.Request,
  res: express.Response
) => { 
  
  let authToken =
    get(req.cookies, 'X-Auth-Token') ||
    get(req.headers, 'Authorization') ||
    get(req.headers, 'authorization');

  authToken = authToken && authToken.replace('Bearer ', 'token');
  authToken = authToken && authToken.split(',').length >1?authToken.split(',')[0]:authToken;

  clearAuthCookies(req, res);
  let session = null;
  try {
    session = await accountsServer.logout(authToken);
  } catch (err) {
    //sendError(res, err);
  }finally{
    let userAgent = getUserAgent(req) || '';
    const ip = requestIp.getClientIp(req);
    let status = 'success';
    let message = '';
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
    await getObject('operation_logs').insert({
      name: '注销',
      type: 'logout',
      remote_user: session?.userId,
      remote_addr: ip,
      http_user_agent: userAgent,
      is_mobile: is_phone,
      is_tablet,
      object: 'users',
      status: status,
      create: new Date(),
      space: session?.space,
      message: message,
      data: JSON.stringify({
        authToken: authToken,
        session: session
      }),
      related_to: {
        o: "users",
        ids: [session?.userId]
      }
    })
  }
  res.json(null);
};
