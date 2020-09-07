import * as express from 'express';
import { AccountsServer } from '../../server';
import { sendError } from '../utils/send-error';

export const getUser = (accountsServer: AccountsServer) => async (
  req: express.Request,
  res: express.Response
) => {
  const user = (req as any).user
  if (!user)
    sendError(res, {message: "userNotFound"});
  res.json(user);
};
