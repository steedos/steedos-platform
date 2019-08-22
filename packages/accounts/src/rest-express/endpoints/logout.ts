import * as express from 'express';
import { AccountsServer } from '@accounts/server';
import { sendError } from '../utils/send-error';

export const logout = (accountsServer: AccountsServer) => async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { authToken } = req as any;
    await accountsServer.logout(authToken);
    res.json(null);
  } catch (err) {
    sendError(res, err);
  }
};
