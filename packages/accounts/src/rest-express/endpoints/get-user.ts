import * as express from 'express';
import { AccountsServer } from '@accounts/server';

export const getUser = (accountsServer: AccountsServer) => async (
  req: express.Request,
  res: express.Response
) => {
  res.json((req as any).user || null);
};
