import * as express from 'express';
import { URL } from 'url';
import { get, isEmpty } from 'lodash';
import { AccountsServer } from '@accounts/server';
import { sendError } from '../utils/send-error';
import { setAuthCookies, clearAuthCookies } from '../utils/steedos-auth';
import { getUserIdByToken } from '@steedos/auth';
import * as requestIp from 'request-ip';
import { getUserAgent } from '../utils/get-user-agent';

const queryString = require('querystring');

export const authorize = (accountsServer: AccountsServer) => async (
  req: express.Request,
  res: express.Response
) => {
  const response_type = req.query.response_type || "code"
  const client_id = req.query.client_id || "steedos"
  const connection = req.query.connection || "steedos"
  const state = req.query.state || ""
  const userAgent = getUserAgent(req);
  const ip = requestIp.getClientIp(req);
  let query = queryString.stringify(req.query);
  let redirect_uri = req.query.redirect_uri
  if (!redirect_uri)
    redirect_uri = "/"

  let userId = (req as any).userId
  let userIdCookie = get(req.cookies, 'X-User-Id') 
  let userAccessTokenCookie = get(req.cookies, 'X-Access-Token');
  let userAuthToken = get(req.cookies, 'X-Auth-Token')
  let userSpaceId = get(req.cookies, 'X-Space-Id')
  //如果userAccessTokenCookie不存在并且有X-User-Id,X-Auth-Token有效(调用Meteor)，自动生成
  if(userAuthToken && userIdCookie && !userAccessTokenCookie){
    let tokenUserId = await getUserIdByToken(userAuthToken);
    if(tokenUserId && tokenUserId === userIdCookie){
      userId = tokenUserId;
      let user: any = await accountsServer.findUserById(userId);
      const loggedInUser: any = await accountsServer.loginWithUser(user, {
        ip,
        userAgent
      })
      userAccessTokenCookie = loggedInUser.tokens.accessToken;
      setAuthCookies(req, res, userId, userAuthToken, userAccessTokenCookie, null);
    }
  }

  if (userId && (userIdCookie== userId)) {
    if (redirect_uri.indexOf("?") > -1)
      redirect_uri += "&token=" + userAccessTokenCookie
    else 
      redirect_uri += "?token=" + userAccessTokenCookie
    redirect_uri = `${redirect_uri}&X-Auth-Token=${userAuthToken}&X-User-Id=${userIdCookie}`
    res.redirect(redirect_uri);
    res.end();
  } else {
    //从cookies中读取X-Space-Id， 并传入login?X-Space-Id=${X-Space-Id}
    if(userSpaceId){
      if(query){
        query = `${query}&X-Space-Id=${userSpaceId}`
      }else{
        query = `X-Space-Id=${userSpaceId}`
      }
    }
    clearAuthCookies(req, res);
    res.redirect("/accounts/a/#/login?" + query);
    res.end();
  }
};
