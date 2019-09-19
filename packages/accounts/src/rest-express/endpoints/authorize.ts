import * as express from 'express';
import { URL } from 'url';
import { get, isEmpty } from 'lodash';
import { AccountsServer } from '@accounts/server';
import { sendError } from '../utils/send-error';
import { setAuthCookies, clearAuthCookies } from '../utils/steedos-auth';

export const authorize = (accountsServer: AccountsServer) => async (
  req: express.Request,
  res: express.Response
) => {
  
  const response_type = req.query.response_type || "code"
  const client_id = req.query.client_id || "steedos"
  const connection = req.query.connection || "steedos"
  const state = req.query.state || ""
  const redirect_uri = req.query.redirect_uri
  const query = req.url.substring("/authorize".length)

  let userId = (req as any).userId
  let userIdCookie = get(req.cookies, 'X-User-Id') 
  let userAccessTokenCookie = get(req.cookies, 'X-Access-Token') 
  if (userId && (userIdCookie== userId)) {
    if (redirect_uri) {
      const redirectURL = new URL(redirect_uri);
      redirectURL.searchParams.set("token", userAccessTokenCookie)
      res.redirect(redirectURL.toString());
      res.end();
    } else {
      res.redirect("/");
      res.end();
    }
  } else {
    clearAuthCookies(req, res);
    res.redirect("/accounts/a/login" + query);
    res.end();
  }
};
