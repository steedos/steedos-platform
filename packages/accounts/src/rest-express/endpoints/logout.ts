import * as express from 'express';
import { get, isEmpty, map } from 'lodash';
import { AccountsServer } from '../../server';
import { sendError } from '../utils/send-error';
import { clearAuthCookies } from '../utils/steedos-auth';

export const logout = (accountsServer: AccountsServer) => async (
  req: express.Request,
  res: express.Response
) => {  
  try {
    const authToken =
    get(req.cookies, 'X-Access-Token') ||
    get(req.body, 'accessToken', undefined);
    clearAuthCookies(req, res);
    await accountsServer.logout(authToken);
    res.json(null);
  } catch (err) {
    sendError(res, err);
  }
};
