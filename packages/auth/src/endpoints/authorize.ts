/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-12-06 20:36:52
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2025-03-04 15:27:15
 * @Description:
 */
import { Request, Response } from "express-serve-static-core";
import { clearAuthCookies, setAuthCookies } from "../utils";
const queryString = require("querystring");

declare var __meteor_runtime_config__: any;

export const authorize = async (req: Request, res: Response) => {
  const user = (req as any).user;
  let query = queryString.stringify(req.query);
  let redirect_uri = req.query.redirect_uri
    ? (req.query.redirect_uri as string)
    : "/";
  if (user) {
    setAuthCookies(req, res, user.userId, user.authToken, user.spaceId);
    if (redirect_uri.indexOf("no_redirect=1") < 0) {
      redirect_uri =
        redirect_uri.indexOf("?") > 0
          ? redirect_uri + "&no_redirect=1"
          : redirect_uri + "?no_redirect=1";
      res.redirect(redirect_uri);
    }
    res.end();
  } else {
    clearAuthCookies(req, res);
    res.redirect((process.env.ROOT_URL_PATH_PREFIX || "") + "/login?" + query);
    res.end();
  }
};
