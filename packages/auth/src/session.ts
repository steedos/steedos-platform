import { SteedosUserSession, isTemplateSpace, wrapAsync } from '@steedos/objectql';
import { Response } from "express";
import { getUserIdByToken } from './tokenMap'
import { getUserSession } from './userSession'
import { getSpaceUserSession } from './spaceUserSession'

import * as core from "express-serve-static-core";
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
  return session
}

export async function getSessionByUserId(userId, spaceId?): Promise<SteedosUserSession> {
  if (!userId) {
    return;
  }

  let userSession = await getUserSession(userId);
  if (!userSession) {
    return;
  }

  let spaceUserSession = {}
  if (spaceId) {
    spaceUserSession = await getSpaceUserSession(spaceId, userId);
  }

  return assignSession(spaceId, userSession, spaceUserSession);
}

export function getSessionByUserIdSync(userId, spaceId?): any {
  let getSessionFn = function () {
    return getSessionByUserId(userId, spaceId);
  }
  return wrapAsync(getSessionFn, {});
}


export async function getSession(token: string, spaceId?: string): Promise<SteedosUserSession> {
  if (!token) {
    return
  }

  let userId = await getUserIdByToken(token);
  if (!userId) {
    return
  }

  let userSession = await getUserSession(userId);
  if (!userSession) {
    return;
  }
  let spaceUserSession = await getSpaceUserSession(spaceId, userId);

  return assignSession(spaceId, userSession, spaceUserSession);
}

// 解析Request对象，返回SteedosUserSession类型
export async function auth(request: Request, response: Response): Promise<any> {
  let cookies = new Cookies(request, response);
  let authToken: string = request.headers['x-auth-token'] || cookies.get("X-Auth-Token");
  let spaceToken = cookies.get("X-Space-Token");
  let authorization = request.headers.authorization;
  let spaceId = (request.params ? request.params.spaceId : null)
    || (request.query ? request.query.space_id : null)
    || request.headers['x-space-id'];
  if (authorization && authorization.split(' ')[0] == 'Bearer') {
    let spaceAuthToken = authorization.split(' ')[1];
    if (!spaceId) {
      spaceId = spaceAuthToken.split(',')[0];
    }
    authToken = spaceAuthToken.split(',')[1];
  }

  if (spaceToken) {
    if (!spaceId) {
      spaceId = spaceToken.split(',')[0];
    }
    if (!authToken) {
      authToken = spaceToken.split(',')[1];
    }
  }

  let user = await getSession(authToken, spaceId as string);
  if (isTemplateSpace(spaceId)) {
    return Object.assign({ authToken: authToken }, user, { spaceId: spaceId });
  } else {
    return Object.assign({ authToken: authToken }, user);
  }

}

// 给Request对象添加user属性，值为SteedosUserSession类型
export async function setRequestUser(request: Request, response: Response, next: () => void) {
  let user = await auth(request, response);
  if (user.userId) {
    request.user = user;
  }
  next();
}