import { SteedosUserSession, isTemplateSpace, wrapAsync } from '@steedos/objectql';
import { Response } from "express";
import { getUserIdByToken, removeUserTokens } from './tokenMap'
import { getUserSession } from './userSession'
import { getSpaceUserSession } from './spaceUserSession'

import * as core from "express-serve-static-core";
import { isAPIKey, verifyAPIKey } from './apikey';

import isMobile from "ismobilejs";
interface Request extends core.Request {
  user?: any;
}

const Cookies = require("cookies");

function assignSession(spaceId, userSession, spaceSession) {
  let result = Object.assign({ spaceId: spaceId }, userSession, spaceSession);
  return reviseSession(result);
}

function reviseSession(session) {
  if (session) {
    delete session.expiredAt;
    delete session._id;
  }
  return session;
}

export async function getSessionByUserId(
  userId,
  spaceId?
): Promise<SteedosUserSession> {
  if (!userId) {
    return;
  }

  let userSession = await getUserSession(userId);
  if (!userSession) {
    return;
  }

  let spaceUserSession = {};
  if (spaceId) {
    spaceUserSession = await getSpaceUserSession(spaceId, userId);
  }

  return assignSession(spaceId, userSession, spaceUserSession);
}

export function getSessionByUserIdSync(userId, spaceId?): any {
  let getSessionFn = function() {
    return getSessionByUserId(userId, spaceId);
  };
  return wrapAsync(getSessionFn, {});
}

export async function getSession(
  token: string,
  spaceId?: string,
  clientInfos?: any
): Promise<SteedosUserSession> {
  if (!token) {
    return;
  }
  let userId = null;
  if (isAPIKey(token)) {
    const apiKeyInfo = await verifyAPIKey(token);
    if (apiKeyInfo) {
      userId = apiKeyInfo.userId;
      spaceId = apiKeyInfo.spaceId;
    }
  } else {
    userId = await getUserIdByToken(token, clientInfos);
  }
  if (!userId) {
    return;
  }
  let userSession = await getUserSession(userId);
  if (!userSession) {
    return;
  }
  let spaceUserSession = await getSpaceUserSession(spaceId, userId);

  return assignSession(spaceId, userSession, spaceUserSession);
}

export function getUserAgent(req: any) {
  let userAgent: string = (req.headers["user-agent"] as string) || "";
  if (req.headers["x-ucbrowser-ua"]) {
    // special case of UC Browser
    userAgent = req.headers["x-ucbrowser-ua"] as string;
  }
  return userAgent;
}

export function getLoginDevice(userAgent) {
  let is_phone = false;
  let is_tablet = false;
  if (userAgent) {
    try {
      const { phone, tablet } = isMobile(userAgent);
      is_phone = phone;
      is_tablet = tablet;
    } catch (Exception) {
      console.log(`Exception`, Exception);
    }
  }
  return { is_phone, is_tablet };
}

// 解析Request对象，返回SteedosUserSession类型
export async function auth(request: Request, response: Response): Promise<any> {
  let cookies = new Cookies(request, response);
  let authToken: any =
    request.headers["x-auth-token"] || (cookies.get("X-Auth-Token") || "").replace(/"/g, "");
    let spaceToken = (cookies.get("X-Space-Token") || "").replace(/"/g, "");
  let authorization = request.headers.authorization;
  let spaceId =
    (request.params ? request.params.spaceId : null) ||
    (request.query ? request.query.space_id : null) ||
    request.headers["x-space-id"];
  if (authorization && authorization.split(" ")[0] == "Bearer") {
    let spaceAuthToken = authorization.split(" ")[1];
    if (isAPIKey(spaceAuthToken)) {
      authToken = spaceAuthToken;
    } else {
      const splitSpaceId = spaceAuthToken.split(",")[0];
      const splitAuthtoken = spaceAuthToken.split(",")[1];
      if (!spaceId && splitSpaceId) {
        spaceId = splitSpaceId;
      }
      if (splitAuthtoken) {
        authToken = splitAuthtoken;
      }
    }
  }

  if (spaceToken) {
    if (!spaceId) {
      spaceId = spaceToken.split(",")[0];
    }
    if (!authToken) {
      authToken = spaceToken.split(",")[1];
    }
  }

  if(request.query['X-Auth-Token']){
    authToken = request.query['X-Auth-Token']
  }

  if(request.query['X-Space-Id']){
    spaceId = request.query['X-Space-Id']
  }

  let userAgent = getUserAgent(request) || "";
  const loginDevice = getLoginDevice(userAgent);
  let user = await getSession(authToken, spaceId as string, loginDevice);
  if (isTemplateSpace(spaceId)) {
    return Object.assign({ authToken: authToken }, user, loginDevice, {
      spaceId: spaceId,
    });
  } else {
    return Object.assign({ authToken: authToken }, user, loginDevice);
  }
}

// 给Request对象添加user属性，值为SteedosUserSession类型
export async function setRequestUser(
  request: Request,
  response: Response,
  next: () => void
) {
  let user = await auth(request, response);
  if (user.userId) {
    request.user = user;
  }
  next();
}

export function removeUserSessionsCacheByUserId(userId, is_phone) {
  return removeUserTokens(userId, is_phone);
}

/**
 * 判断属性值是否已变更，转字符串比对
 * @param newDoc 
 * @param oldDoc 
 * @returns true/false
 */
export function isPropValueChanged (newDoc: any, oldDoc: any, props: string[]): boolean {
  for (const key of props) {
      if ((newDoc[key] + '') !== (oldDoc[key] + '')) {
          return true
      }
  }
  return false
}