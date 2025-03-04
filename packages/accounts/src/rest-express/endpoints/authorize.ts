import * as express from "express";
import { URL } from "url";
import { get, isEmpty } from "lodash";
import { AccountsServer } from "../../server";
import { sendError } from "../utils/send-error";
import { setAuthCookies, clearAuthCookies } from "../utils/steedos-auth";
import { getUserIdByToken } from "@steedos/auth";
import * as requestIp from "request-ip";
import { getUserAgent } from "../utils/get-user-agent";

const queryString = require("querystring");

declare var __meteor_runtime_config__: any;

export const authorize =
  (accountsServer: AccountsServer) =>
  async (req: express.Request, res: express.Response) => {
    const response_type = req.query.response_type || "code";
    const client_id = req.query.client_id || "steedos";
    const connection = req.query.connection || "steedos";
    const state = req.query.state || "";
    const userAgent = getUserAgent(req);
    const ip = requestIp.getClientIp(req);
    let query = queryString.stringify(req.query);
    let redirect_uri = req.query.redirect_uri
      ? (req.query.redirect_uri as string)
      : "/";
    let authToken =
      get(req.cookies, "X-Auth-Token") ||
      get(req.body, "X-Auth-Token") ||
      get(req.params, "X-Auth-Token") ||
      get(req.headers, "Authorization") ||
      get(req.headers, "authorization");

    authToken =
      authToken && authToken.replace("Bearer ", "").replace("BEARER ", "");
    authToken =
      authToken && authToken.split(",").length > 1
        ? authToken.split(",")[0]
        : authToken;

    let userId =
      get(req.cookies, "X-User-Id") ||
      get(req.body, "X-User-Id") ||
      get(req.params, "X-User-Id");

    const user = (req as any).user;

    if (user) {
      if (redirect_uri.indexOf("no_redirect=1") < 0) {
        redirect_uri =
          redirect_uri.indexOf("?") > 0
            ? redirect_uri + "no_redirect=1"
            : redirect_uri + "?no_redirect=1";
        redirect_uri = `${redirect_uri}&X-Auth-Token=${authToken}&X-User-Id=${userId}`;
        res.redirect(redirect_uri);
      }
      res.end();
    } else {
      clearAuthCookies(req, res);
      res.redirect(
        (process.env.ROOT_URL_PATH_PREFIX || "") + "/login?" + query,
      );
      res.end();
    }
  };
