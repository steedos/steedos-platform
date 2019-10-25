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
  const query = queryString.stringify(req.query);
  let redirect_uri = req.query.redirect_uri
  if (!redirect_uri)
    redirect_uri = "/"

  let userId = (req as any).userId
  let userIdCookie = get(req.cookies, 'X-User-Id') 
  let userAccessTokenCookie = get(req.cookies, 'X-Access-Token') 
  if (userId && (userIdCookie== userId)) {
    if (redirect_uri.indexOf("?"))
      redirect_uri += "&token=" + userAccessTokenCookie
    else 
      redirect_uri += "?token=" + userAccessTokenCookie
    res.redirect(redirect_uri);
    res.end();
  } else {
    clearAuthCookies(req, res);
    res.redirect("/accounts/a/login?" + query);
    res.end();
  }
};
