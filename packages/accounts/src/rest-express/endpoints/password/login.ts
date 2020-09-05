import * as express from 'express';
import * as requestIp from 'request-ip';
import { AccountsServer, generateRandomToken } from '../../../server';
import { getUserAgent } from '../../utils/get-user-agent';
import { sendError } from '../../utils/send-error';

export const login = (accountsServer: AccountsServer) => async (
  req: express.Request,
  res: express.Response
) => {

  try {
    const user = req.body.user;
    const password = req.body.password;

    if (!user || !password) {
      res.status(401);
      res.json({ message: 'Bad request' });
      return;
    }

    let userAgent = getUserAgent(req) || '';
    const ip = requestIp.getClientIp(req);

    const loggedInUser: any = await accountsServer.loginWithService('password', req.body, {
      ip,
      userAgent
    });

    res.json(loggedInUser);
    return;
  } catch (err) {
    sendError(res, err);
  }
}