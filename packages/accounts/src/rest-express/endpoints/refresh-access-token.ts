import * as express from 'express';
import * as requestIp from 'request-ip';
import { AccountsServer } from '@accounts/server';
import { getUserAgent } from '../utils/get-user-agent';
import { sendError } from '../utils/send-error';

export const refreshAccessToken = (accountsServer: AccountsServer) => async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { accessToken, refreshToken } = req.body;
    const userAgent = getUserAgent(req);
    const ip = requestIp.getClientIp(req);
    const refreshedSession = await accountsServer.refreshTokens(
      accessToken,
      refreshToken,
      ip,
      userAgent
    );
    res.json(refreshedSession);
  } catch (err) {
    sendError(res, err);
  }
};
