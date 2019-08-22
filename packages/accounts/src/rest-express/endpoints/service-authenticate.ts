import * as express from 'express';
import * as requestIp from 'request-ip';
import { AccountsServer } from '@accounts/server';
import { getUserAgent } from '../utils/get-user-agent';
import { sendError } from '../utils/send-error';

export const serviceAuthenticate = (accountsServer: AccountsServer) => async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const serviceName = req.params.service;
    const userAgent = getUserAgent(req);
    const ip = requestIp.getClientIp(req);
    const loggedInUser = await accountsServer.loginWithService(serviceName, req.body, {
      ip,
      userAgent,
    });
    res.json(loggedInUser);
  } catch (err) {
    sendError(res, err);
  }
};
