/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2024-06-16 17:46:33
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-08-02 10:55:54
 * @Description: 
 */
import crypto = require('crypto');
import { default as Random } from './random';
import { getSteedosSchema } from '@steedos/objectql';
import { setCookie, clearCookie } from '@steedos/utils';

export const hashLoginToken = function (loginToken) {
  const hash = crypto.createHash('sha256');
  hash.update(loginToken);
  return hash.digest('base64');
}

export const generateStampedLoginToken = function () {
  return {
    token: Random.secret(),
    when: new Date
  };
}

export const hashStampedToken = function (stampedToken) {
  const hashedStampedToken = Object.keys(stampedToken).reduce(
    (prev, key) => key === 'token' ?
      prev :
      { ...prev, [key]: stampedToken[key] },
    {},
  )
  return {
    ...hashedStampedToken,
    hashedToken: hashLoginToken(stampedToken.token)
  };
}

export const insertHashedLoginToken = async function (userId, hashedToken) {
  let userObject = getSteedosSchema().getObject('users')
  let user = await userObject.findOne(userId, { fields: ['services'] })
  if(!user['services']){
    user['services'] = {}
  }
  if(!user['services']['resume']){
    user['services']['resume'] = {loginTokens: []}
  }
  user['services']['resume']['loginTokens'].push(hashedToken)
  let data = { services: user['services'] }
  return await userObject.update(userId, data);
}

export const setAuthCookies = function (req, res, userId, authToken, spaceId?) {
  let options = {
    maxAge: 90 * 60 * 60 * 24 * 1000,
    httpOnly: true,
    overwrite: true
  }
  setCookie(req, res, "X-User-Id", userId, options as any);
  setCookie(req, res, "X-Auth-Token", authToken, options as any)

  if (spaceId) {
    setCookie(req, res, "X-Space-Id", spaceId, options as any);
    // cookies.set("X-Space-Token", spaceId + ',' + authToken, options);
  }

  return;
}


export const clearAuthCookies = function (req, res) {
  let options = {
    maxAge: 0,
    httpOnly: true,
    overwrite: true
  }

  clearCookie(req, res, "X-User-Id", options as any)
  clearCookie(req, res, "X-Auth-Token", options as any)

  clearCookie(req, res, "X-Access-Token", options as any)
  clearCookie(req, res, "X-Space-Token", options as any)

  return;
}

export function isExpried(expiredAt: number) {
  return expiredAt <= new Date().getTime();
}