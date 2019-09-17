import crypto = require('crypto');
import { getSteedosSchema, SteedosUserSession, SteedosIDType, SteedosUserSessionSpace, SteedosUserSessionCompany, SteedosUserSessionOrganization } from '@steedos/objectql';
import { Response } from "express";

import * as core from "express-serve-static-core";
interface Request extends core.Request {
  user?: any;
}

const _ = require('underscore');

const Cookies = require("cookies");

const sessions = {};
const size = 35000;
const tokens = [];
const spaceSessions = {};
const spacetokens = [];
const sessionCacheInMinutes = 10;

interface Session {
  userId: SteedosIDType;
  name: string;
  username?: string;
  mobile?: string;
  email?: string;
  utcOffset?: number;
  steedos_id?: string;
  expiredAt?: number;
}

interface SpaceSession {
  roles: string[];
  space: SteedosUserSessionSpace;
  spaces: SteedosUserSessionSpace[];
  company?: SteedosUserSessionCompany;
  companies?: SteedosUserSessionCompany[];
  organization: SteedosUserSessionOrganization;
  organizations: SteedosUserSessionOrganization[];
  expiredAt: number;
}

function _hashLoginToken(token: string) {
  const hash = crypto.createHash('sha256');
  hash.update(token);
  return hash.digest('base64');
}

function isExpried(expiredAt: number) {
  return expiredAt <= new Date().getTime();
}

function reovkeSessionFromCache(token: string) {
  return delete sessions[token];
}

function addSessionToCache(token: string, session: Session) {
  sessions[token] = session;
  tokens.push(token);
  if (tokens.length > size) {
    reovkeSessionFromCache(tokens.shift());
  }
}

function getSessionFromCache(token: string) {
  let session = sessions[token];
  if (!session) {
    return null;
  }
  if (isExpried(session.expiredAt)) {
    reovkeSessionFromCache(token);
    return null;
  }
  return session;
}

async function getUser(token: string) {
  let hashedToken = _hashLoginToken(token).replace(/\//g, '%2F');
  let filters = `(services/resume/loginTokens/hashedToken eq '${hashedToken}')`;
  let users = await getSteedosSchema().getObject('users').find({ filters: filters, fields: ['name', 'username', 'mobile', 'email', 'utcOffset', 'steedos_id'] });
  return users[0];
}

async function getUserRoles(userId: string, spaceId: string) {
  let roles = ['user'];
  let space = await getSteedosSchema().getObject('spaces').findOne(spaceId, { fields: ['admins'] });
  if (space && space.admins.includes(userId)) {
    roles = ['admin'];
  }

  let filters = `(space eq '${spaceId}') and (users eq '${userId}')`;
  let permission_sets = await getSteedosSchema().getObject('permission_set').find({ filters: filters, fields: ['name'] });
  permission_sets.forEach(p => {
    roles.push(p.name);
  });

  //console.log('roles：', roles)

  return roles;
}

function assignSession(spaceId, userSession, spaceSession) {
  let result = Object.assign({ spaceId: spaceId }, userSession, spaceSession);
  return reviseSession(result);
}

function reviseSession(session) {
  if (session) {
    delete session.expiredAt;
  }
  return session
}

function reovkeSpaceSessionFromCache(key: string) {
  return delete spaceSessions[key];
}

function addSpaceSessionToCache(token: string, spaceId: string, spaceSession: SpaceSession) {
  let key = `${token}-${spaceId}`;
  spaceSessions[key] = spaceSession;
  spacetokens.push(key);
  if (spacetokens.length > size) {
    reovkeSpaceSessionFromCache(spacetokens.shift());
  }
}

function getSpaceSessionFromCache(token: string, spaceId: string) {
  let key = `${token}-${spaceId}`;
  let spaceSession = spaceSessions[key];
  if (!spaceSession) {
    return null;
  }
  if (isExpried(spaceSession.expiredAt)) {
    reovkeSpaceSessionFromCache(key);
    return null;
  }
  return spaceSession;
}

async function getObjectDataByIds(objectName: string, ids: string[], fields?: string[]) {
  if (!ids || ids.length === 0) {
    return []
  }

  let filters = _.map(ids, function (id) {
    if (!id) {
      return ''
    }
    return `(_id eq '${id}')`
  }).join(' or ');

  if (!filters) {
    return []
  }

  let query = { filters: filters };
  if (fields && fields.length > 0) {
    query['fields'] = fields;
  }

  return await getSteedosSchema().getObject(objectName).find(query)
}

export async function getSession(token: string, spaceId?: string): Promise<SteedosUserSession> {
  if (!token) {
    return
  }
  let expiredAt = new Date().getTime() + sessionCacheInMinutes * 60 * 1000;
  let session = getSessionFromCache(token);
  if (!session) {
    let user = await getUser(token);
    if (user) {
      session = {};
      session.userId = user._id;
      session.name = user.name;
      session.username = user.username;
      session.mobile = user.mobile;
      session.email = user.email;
      session.utcOffset = user.utcOffset;
      session.steedos_id = user.steedos_id;
      session.expiredAt = expiredAt;
      addSessionToCache(token, session);
    }
    else {
      return
    }
  }

  let spaceSession = getSpaceSessionFromCache(token, spaceId);
  if (!spaceSession) {
    let user = await getUser(token);
    if (user) {
      let su = null;
      let suFields = ['space', 'company_id', 'company_ids', 'organization', 'organizations'];
      let spaceUser = await getSteedosSchema().getObject('space_users').find({ filters: `(space eq '${spaceId}') and (user eq '${user._id}')`, fields: suFields });
      // 如果spaceid和user不匹配，则取用户的第一个工作区
      let spaceUsers = await getSteedosSchema().getObject('space_users').find({ filters: `(user eq '${user._id}')`, fields: suFields });
      if (spaceUser && spaceUser[0]) {
        su = spaceUser[0];
      } else {
        su = spaceUsers[0];
      }

      if (su) {
        let userSpaceId = su.space;
        let userSpaceIds = _.pluck(spaceUsers, 'space');
        let roles = await getUserRoles(user._id, userSpaceId);
        spaceSession = { roles: roles, expiredAt: expiredAt };
        spaceSession.space = (await getObjectDataByIds('spaces', [userSpaceId], ['name']))[0];
        spaceSession.spaces = await getObjectDataByIds('spaces', userSpaceIds, ['name']);
        spaceSession.company = (await getObjectDataByIds('company', [su.company_id], ['name', 'organization']))[0];
        spaceSession.companies = await getObjectDataByIds('company', su.company_ids, ['name', 'organization']);
        spaceSession.organization = (await getObjectDataByIds('organizations', [su.organization], ['name', 'fullname', 'company_id']))[0];
        spaceSession.organizations = await getObjectDataByIds('organizations', su.organizations, ['name', 'fullname', 'company_id']);
        addSpaceSessionToCache(token, userSpaceId, spaceSession);
        return assignSession(userSpaceId, session, spaceSession);
      }
    }
  }
  return assignSession(spaceId, session, spaceSession);
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
    spaceId = spaceAuthToken.split(',')[0];
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

  let user = await getSession(authToken, spaceId);
  return Object.assign({ authToken: authToken }, user);
}

// 给Request对象添加user属性，值为SteedosUserSession类型
export async function setRequestUser(request: Request, response: Response, next: () => void) {
  let user = await auth(request, response);
  if (user.userId) {
    request.user = user;
  }
  next();
}