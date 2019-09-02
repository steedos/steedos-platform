import crypto = require('crypto');
const Cookies = require('cookies');

export const hashLoginToken = function (loginToken) {
    const hash = crypto.createHash('sha256');
    hash.update(loginToken);
    return hash.digest('base64');
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

export const setAuthCookies = function (req, res, userId, authToken, accessToken, spaceId?) {
    let cookies = new Cookies(req, res);
    let options = {
      maxAge: 90 * 60 * 60 * 24 * 1000,
      httpOnly: false,
      overwrite: true
    }
    cookies.set("X-User-Id", userId, options);
    cookies.set("X-Auth-Token", authToken, options);
    cookies.set("X-Access-Token", accessToken, options);
    if (spaceId) {
      cookies.set("X-Space-Id", spaceId, options);
      cookies.set("X-Space-Token", spaceId + ',' + authToken, options);
    }
    return;
}

export const clearAuthCookies = function (req, res) {
  let cookies = new Cookies(req, res);
  let options = {
    maxAge: 90 * 60 * 60 * 24 * 1000,
    httpOnly: false,
    overwrite: true
  }
  cookies.set("X-User-Id", null, options);
  cookies.set("X-Auth-Token", null, options);
  cookies.set("X-Access-Token", null, options);
  cookies.set("X-Space-Token", null, options);
  return;
}
