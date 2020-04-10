import * as express from 'express';
import * as requestIp from 'request-ip';
import { AccountsServer } from '@accounts/server';
import { getUserAgent } from '../utils/get-user-agent';
import { sendError } from '../utils/send-error';
import { setAuthCookies, getAuthTokenCookie } from '../utils/steedos-auth';
import { db } from '../../db';
import { getUserSpace } from '../utils/users'
import * as _ from 'lodash';

export const updateSession = (accountsServer: AccountsServer) => async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const userId = (req as any).user._id;
    const serviceName = req.params.service;
    let userAgent = getUserAgent(req) || '';
    const ip = requestIp.getClientIp(req);
    let services: any = accountsServer.getServices();
    let db = services[serviceName].db;
    const spaceId = req.body.spaceId;
    let accessToken = req.body.accessToken;
    let session:any = await accountsServer.findSessionByAccessToken(accessToken)

    if(!session){
      throw new Error('Invalid accessToken');
    }

    //获取用户有效的工作区Id，并且写入Sessions中
    let validSpaceId = await getUserSpace(userId, spaceId);
    if(validSpaceId){
      userAgent = `${userAgent} Space/${validSpaceId}`
      db.updateSession(session.id, {
        ip,
        userAgent});
    }
    
    // 设置cookies
    setAuthCookies(req, res, session.userId, getAuthTokenCookie(req, res), accessToken, validSpaceId);

    res.json({});
  } catch (err) {
    sendError(res, err);
  }
};
