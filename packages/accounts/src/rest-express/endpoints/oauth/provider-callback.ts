import * as express from 'express';
import * as requestIp from 'request-ip';
import { AccountsServer } from '@accounts/server';
import { getUserAgent } from '../../utils/get-user-agent';
import { sendError } from '../../utils/send-error';
import { AccountsExpressOptions } from '../../types';

interface RequestWithSession extends express.Request {
  session: any;
}

export const providerCallback = (
  accountsServer: AccountsServer,
  options?: AccountsExpressOptions
) => async (req: express.Request, res: express.Response) => {
  try {
    const userAgent = getUserAgent(req);
    const ip = requestIp.getClientIp(req);
    const loggedInUser = await accountsServer.loginWithService(
      'oauth',
      {
        ...(req.params || {}),
        ...(req.query || {}),
        ...(req.body || {}),
        ...((req as RequestWithSession).session || {}),
      },
      { ip, userAgent }
    );

    if (options && options.onOAuthSuccess) {
      options.onOAuthSuccess(req, res, loggedInUser);
    }

    if (options && options.transformOAuthResponse) {
      res.json(options.transformOAuthResponse(loggedInUser));
    } else {
      res.json(loggedInUser);
    }
  } catch (err) {
    if (options && options.onOAuthError) {
      options.onOAuthError(req, res, err);
    }

    sendError(res, err);
  }
};
