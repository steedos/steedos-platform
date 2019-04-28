import crypto = require('crypto');
import { getSteedosSchema } from '@steedos/objectql';

const sessions = {};

function _hashLoginToken(token) {
  const hash = crypto.createHash('sha256');
  hash.update(token);
  return hash.digest('base64');
}

export function addSessionToCache(token, session) {
  sessions[token] = session;
}

export function getSessionFromCache(token) {
  return sessions[token];
}

export async function getSession(userId, token) {
  if (getSessionFromCache(token)) {
    return getSessionFromCache(token);
  } else {
    let hashedToken = _hashLoginToken(token);
    let filters = `(_id eq '${userId}') and ('services.resume.loginTokens.hashedToken' eq '${hashedToken}')`;
    console.log('filters:', filters)
    let user = await getSteedosSchema().getObject('users').find({ filters: filters, fields: ['name', 'steedos_id', 'email'] })
    let session = { name: user.name, userId: user._id, steedos_id: user.steedos_id, email: user.email, token: token }
    addSessionToCache(token, session)
    return session
  }

}