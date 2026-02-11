import * as express from "express";
import { getClientIp } from "../utils/getClientIp";
import { AccountsServer } from "../../server";
import { getUserAgent } from "../utils/get-user-agent";
import { sendError } from "../utils/send-error";
import { setAuthCookies, hashStampedToken } from "../utils/steedos-auth";
import { db } from "../../db";
import * as _ from "lodash";
import { getUserSpace } from "../utils/users";

export const serviceAuthenticate =
  (accountsServer: AccountsServer) =>
  async (req: express.Request, res: express.Response) => {
    try {
      const serviceName = req.params.service;
      let userAgent = getUserAgent(req) || "";
      const ip = getClientIp(req);
      const email = req.body.user.email;
      const spaceId = req.body.spaceId;
      let services: any = accountsServer.getServices();
      let db = services[serviceName].db;

      if (email && email.indexOf("@") < 0) {
        req.body.user.username = email;
      }

      const loggedInUser: any = await accountsServer.loginWithService(
        serviceName,
        req.body,
        {
          ip,
          userAgent,
        },
      );

      //获取user session
      let session: any = await accountsServer.findSessionByAccessToken(
        loggedInUser.tokens.accessToken,
      );

      //获取用户有效的工作区Id，并且写入Sessions中
      let validSpaceId = await getUserSpace(session.userId, spaceId);
      if (validSpaceId) {
        userAgent = `${userAgent} Space/${validSpaceId}`;
        db.updateSession(loggedInUser.sessionId, {
          ip,
          userAgent,
        });
      }

      // OIDC/OAuth用户不检查密码过期，因此不需要获取password_expired
      // Users authenticated via OIDC/OAuth don't need password expiry check

      //创建Meteor token
      let authToken = null;
      let stampedAuthToken = {
        token: session.token,
        when: new Date(),
      };
      authToken = stampedAuthToken.token;
      let hashedToken = hashStampedToken(stampedAuthToken);
      let _user = await db.collection.findOne(
        { _id: session.userId },
        { services: 1 },
      );
      if (!_user["services"]) {
        _user["services"] = {};
      }
      if (!_user["services"]["resume"]) {
        _user["services"]["resume"] = { loginTokens: [] };
      }
      if (!_user["services"]["resume"]["loginTokens"]) {
        _user["services"]["resume"]["loginTokens"] = [];
      }
      _user["services"]["resume"]["loginTokens"].push(hashedToken);
      let data = { services: _user["services"] };
      await db.collection.updateOne({ _id: session.userId }, { $set: data });
      // 设置cookies
      setAuthCookies(
        req,
        res,
        session.userId,
        authToken,
        loggedInUser.tokens.accessToken,
        validSpaceId,
      );

      res.json(loggedInUser);
    } catch (err) {
      sendError(res, err);
    }
  };
