import * as express from 'express';
import { get, isEmpty } from 'lodash';
import { AccountsServer } from '@accounts/server';
import { sendError } from '../utils/send-error';
import { clearAuthCookies } from '../utils/steedos-auth';

export const authorize = (accountsServer: AccountsServer) => async (
  req: express.Request,
  res: express.Response
) => {
  
  const response_type = req.query.response_type || "code"
  const client_id = req.query.client_id || "steedos"
  const connection = req.query.connection || "steedos"
  const state = req.query.state || ""
  const redirect_uri = req.query.redirect_uri || "/"
  const query = req.url.substring("/authorize".length)

  let userId = (req as any).userId
  let userIdCookie = get(req.cookies, 'X-User-Id') 
  if (userId && (userIdCookie== userId)) {
    res.redirect(redirect_uri);
    res.end();
  } else {
    res.redirect("/accounts/a/login" + query);
    res.end();
  }
};
