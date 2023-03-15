import * as express from 'express';
import { AccountsServer } from '../../../server';
import { sendError } from '../../utils/send-error';

export const verifyEmail = (accountsServer: AccountsServer) => async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { token } = req.body;
    const password: any = accountsServer.getServices().password;
    await password.verifyEmail(token);
    res.json(null);
  } catch (err) {
    sendError(res, err);
  }
};

export const sendVerificationEmail = (accountsServer: AccountsServer) => async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { email } = req.body;
    const password: any = accountsServer.getServices().password;
    await password.sendVerificationEmail(email);
    res.json(null);
  } catch (err) {
    sendError(res, err);
  }
};

export const sendVerificationCode = (accountsServer: AccountsServer) => async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { user,geetest } = req.body;
    // console.log('geeetest',geetest)
    const password: any = accountsServer.getServices().password;
    const userId = await password.sendVerificationCode(user,geetest);
    res.json(userId);
  } catch (err) {
    sendError(res, err);
  }
};

