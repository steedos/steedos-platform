import * as express from 'express';
import { AccountsServer } from '@accounts/server';
import { sendError } from '../../utils/send-error';

export const twoFactorSecret = (accountsServer: AccountsServer) => async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const password: any = accountsServer.getServices().password;
    const secret = await password.twoFactor.getNewAuthSecret();
    res.json({ secret });
  } catch (err) {
    sendError(res, err);
  }
};

export const twoFactorSet = (accountsServer: AccountsServer) => async (
  req: express.Request,
  res: express.Response
) => {
  try {
    if (!(req as any).userId) {
      res.status(401);
      res.json({ message: 'Unauthorized' });
      return;
    }
    const password: any = accountsServer.getServices().password;
    await password.twoFactor.set((req as any).userId, req.body.secret, req.body.code);
    res.json({});
  } catch (err) {
    sendError(res, err);
  }
};

export const twoFactorUnset = (accountsServer: AccountsServer) => async (
  req: express.Request,
  res: express.Response
) => {
  try {
    if (!(req as any).userId) {
      res.status(401);
      res.json({ message: 'Unauthorized' });
      return;
    }
    const password: any = accountsServer.getServices().password;
    await password.twoFactor.unset((req as any).userId, req.body.code);
    res.json({});
  } catch (err) {
    sendError(res, err);
  }
};
