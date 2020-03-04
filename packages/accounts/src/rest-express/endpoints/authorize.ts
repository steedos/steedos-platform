import * as express from 'express';
import { URL } from 'url';
import { get, isEmpty } from 'lodash';
import { AccountsServer } from '@accounts/server';
import { sendError } from '../utils/send-error';
import { setAuthCookies, clearAuthCookies } from '../utils/steedos-auth';
const queryString = require('querystring');

export const authorize = (accountsServer: AccountsServer) => async (
  req: express.Request,
  res: express.Response
) => {
  
  const response_type = req.query.response_type || "code"
  const client_id = req.query.client_id || "steedos"
  const connection = req.query.connection || "steedos"
  const state = req.query.state || ""
  let query = queryString.stringify(req.query);
  let redirect_uri = req.query.redirect_uri
  if (!redirect_uri)
    redirect_uri = "/"

  let userId = (req as any).userId
  let userIdCookie = get(req.cookies, 'X-User-Id') 
  let userAccessTokenCookie = get(req.cookies, 'X-Access-Token');
  let userAuthToken = get(req.cookies, 'X-Auth-Token')
  let userSpaceId = get(req.cookies, 'X-Space-Id')

  //TODO 如果userAccessTokenCookie不存在并且有X-User-Id,X-Auth-Token有效(调用Meteor)，自动生成

  //TODO 从cookies中读取X-Space-Id， 并传入login?X-Space-Id=${X-Space-Id}

  if (userId && (userIdCookie== userId)) {
    if (redirect_uri.indexOf("?") > -1)
      redirect_uri += "&token=" + userAccessTokenCookie
    else 
      redirect_uri += "?token=" + userAccessTokenCookie
    redirect_uri = `${redirect_uri}&X-Auth-Token=${userAuthToken}&X-User-Id=${userIdCookie}`
    res.redirect(redirect_uri);
    res.end();
  } else {
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
