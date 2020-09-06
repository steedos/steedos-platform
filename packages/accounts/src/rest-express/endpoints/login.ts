import * as express from 'express';
import * as requestIp from 'request-ip';
import { AccountsServer, generateRandomToken } from '../../server';
import { getUserAgent } from '../utils/get-user-agent';
import { sendError } from '../utils/send-error';
import { setAuthCookies } from '../utils/steedos-auth';

export const login = (accountsServer: AccountsServer) => async (
  req: express.Request,
  res: express.Response
) => {

  try {
    let userAgent = getUserAgent(req) || '';
    const ip = requestIp.getClientIp(req);

    const result: any = await accountsServer.loginWithService('password', req.body, {
      ip,
      userAgent
    });

    setAuthCookies(req, res, result.user._id, result.token, result.tokens.accessToken);

    res.json(result);
    return;
  } catch (err) {
    sendError(res, err);
  }
}