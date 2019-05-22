import crypto = require('crypto');
import { default as Random } from './random';
import { getSteedosSchema } from '@steedos/objectql';

export let utils = {
  _hashLoginToken: function (loginToken) {
    const hash = crypto.createHash('sha256');
    hash.update(loginToken);
    return hash.digest('base64');
  },

  _generateStampedLoginToken: function () {
    return {
      token: Random.secret(),
      when: new Date
    };
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

  _insertHashedLoginToken: async function (userId, hashedToken) {
    let userObject = getSteedosSchema().getObject('users')
    let user = await userObject.findOne(userId, { fields: ['services'] })
    user['services']['resume']['loginTokens'].push(hashedToken)
    let data = { services: user['services'] }
    return await userObject.update(userId, data);
  }
}
