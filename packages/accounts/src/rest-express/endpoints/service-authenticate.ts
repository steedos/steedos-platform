import * as express from 'express';
import * as requestIp from 'request-ip';
import { AccountsServer } from '@accounts/server';
import { getUserAgent } from '../utils/get-user-agent';
import { sendError } from '../utils/send-error';
import { setAuthCookies, hashStampedToken } from '../utils/steedos-auth';
const Cookies = require('cookies');

export const serviceAuthenticate = (accountsServer: AccountsServer) => async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const serviceName = req.params.service;
    const userAgent = getUserAgent(req);
    const ip = requestIp.getClientIp(req);
    const loggedInUser = await accountsServer.loginWithService(serviceName, req.body, {
      ip,
      userAgent,
    });

    //创建Meteor token
    let session:any = await accountsServer.findSessionByAccessToken(loggedInUser.tokens.accessToken)
    let authToken = null;
    let stampedAuthToken = {
      token: session.token,
      when: new Date
    };
    authToken = stampedAuthToken.token;
    let hashedToken = hashStampedToken(stampedAuthToken);
    let services: any = accountsServer.getServices()
    let db = services[serviceName].db
    let _user = await db.collection.findOne({_id: session.userId}, { fields: ['services'] })
    _user['services']['resume']['loginTokens'].push(hashedToken)
    let data = { services: _user['services'] }
    await db.collection.update({_id: session.userId}, {$set: data});
    // 设置cookies
    setAuthCookies(req, res, session.userId, authToken, loggedInUser.tokens.accessToken, null);
    
    res.json(loggedInUser);
  } catch (err) {
    sendError(res, err);
  }
};
