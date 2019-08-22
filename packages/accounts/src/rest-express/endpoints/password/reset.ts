import * as express from 'express';
import { AccountsServer } from '@accounts/server';
import { sendError } from '../../utils/send-error';
import { getUserAgent } from '../../utils/get-user-agent';
import { getClientIp } from 'request-ip';

export const resetPassword = (accountsServer: AccountsServer) => async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { token, newPassword } = req.body;
    const userAgent = getUserAgent(req);
    const ip = getClientIp(req);
    const password: any = accountsServer.getServices().password;
    const loginResult = await password.resetPassword(token, newPassword, { userAgent, ip });
    res.json(loginResult);
  } catch (err) {
    sendError(res, err);
  }
};

export const sendResetPasswordEmail = (accountsServer: AccountsServer) => async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { email } = req.body;
    const password: any = accountsServer.getServices().password;
    await password.sendResetPasswordEmail(email);
    res.json(null);
  } catch (err) {
    sendError(res, err);
  }
};
