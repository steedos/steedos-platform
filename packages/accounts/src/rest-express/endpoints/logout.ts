import * as express from 'express';
import { get, isEmpty, map } from 'lodash';
import { AccountsServer } from '../../server';
import { sendError } from '../utils/send-error';
import { clearAuthCookies } from '../utils/steedos-auth';

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
  try {
    await accountsServer.logout(authToken);
  } catch (err) {
    //sendError(res, err);
  }
  res.json(null);
};
