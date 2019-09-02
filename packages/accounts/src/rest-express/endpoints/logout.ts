import * as express from 'express';
import { AccountsServer } from '@accounts/server';
import { sendError } from '../utils/send-error';
import { clearAuthCookies } from '../utils/steedos-auth';

export const logout = (accountsServer: AccountsServer) => async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { authToken } = req as any;
    await accountsServer.logout(authToken);
    clearAuthCookies(req, res);
    res.json(null);
  } catch (err) {
    sendError(res, err);
  }
};
