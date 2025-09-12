/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2025-02-17 09:39:59
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2025-09-12 14:29:52
 * @FilePath: /steedos-platform-3.0/packages/accounts/src/rest-express/endpoints/oauth/provider-callback.ts
 * @Description:
 */
import * as express from "express";
import { getClientIp } from "../../utils/getClientIp";
import { AccountsServer } from "../../../server";
import { getUserAgent } from "../../utils/get-user-agent";
import { sendError } from "../../utils/send-error";
import { AccountsExpressOptions } from "../../types";

interface RequestWithSession extends express.Request {
  session: any;
}

export const providerCallback =
  (accountsServer: AccountsServer, options?: AccountsExpressOptions) =>
  async (req: express.Request, res: express.Response) => {
    try {
      const userAgent = getUserAgent(req);
      const ip = getClientIp(req);
      const loggedInUser = await accountsServer.loginWithService(
        "oauth",
        {
          ...(req.params || {}),
          ...(req.query || {}),
          ...(req.body || {}),
          ...((req as RequestWithSession).session || {}),
        },
        { ip, userAgent },
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
