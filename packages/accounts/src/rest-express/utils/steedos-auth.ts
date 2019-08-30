import crypto = require('crypto');
const Cookies = require('cookies');

export let utils = {
  _hashLoginToken: function (loginToken) {
    const hash = crypto.createHash('sha256');
    hash.update(loginToken);
    return hash.digest('base64');
  },

  _hashStampedToken: function (stampedToken) {
    const hashedStampedToken = Object.keys(stampedToken).reduce(
      (prev, key) => key === 'token' ?
        prev :
        { ...prev, [key]: stampedToken[key] },
      {},
    )
    return {
      ...hashedStampedToken,
      hashedToken: utils._hashLoginToken(stampedToken.token)
    };
  },

  _setAuthCookies: function (req, res, userId, authToken, spaceId?) {
    let cookies = new Cookies(req, res);
    let options = {
      maxAge: 90 * 60 * 60 * 24 * 1000,
      httpOnly: false,
      overwrite: true
    }
    cookies.set("X-User-Id", userId, options);
    cookies.set("X-Auth-Token", authToken, options);
    if (spaceId) {
      cookies.set("X-Space-Id", spaceId, options);
      cookies.set("X-Space-Token", spaceId + ',' + authToken, options);
    }
    return;
  }
}
