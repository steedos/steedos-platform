/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-03-28 09:35:34
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-11-16 17:15:17
 * @Description: 
 */
import { hashStampedToken, insertHashedLoginToken, hashLoginToken, setAuthCookies } from '../utils';
import { getSteedosSchema } from '@steedos/objectql'

// function secretCallback(req, payload, done) {
//   let issuer = payload.iss
//   let collection = getSteedosSchema().getObject('OAuth2Clients')
//   collection.find({ filters: `clientId eq '${issuer}'` }).then(function (resolve) {
//     let clientInfo = resolve[0]
//     let clientSecret = clientInfo ? clientInfo.clientSecret : ''
//     done(null, clientSecret)
//   }).catch(function (reject) {
//     done(reject, '')
//   })
// }

async function getTokenInfo(req) {
  let payload = req.user
  let data = { userId: '', authToken: '' }
  let userObj = getSteedosSchema().getObject('users')
  let user = (await userObj.find({ filters: `username eq '${payload.username}'`, fields: ['_id'] }))[0]
  if (user) {
    let userId = user._id
    let authToken = payload.sessionId ? `${payload.iss}-${payload.username}-${payload.sessionId}` : `${payload.iss}-${payload.username}`
    let hashedToken = hashLoginToken(authToken).replace(/\//g, '%2F');
    let filters = `(services/resume/loginTokens/hashedToken eq '${hashedToken}')`;
    if (!(await userObj.count({ filters: filters }))) {
      let stampedToken = {
        token: authToken,
        when: new Date
      }
      let hashedTokenObj = hashStampedToken(stampedToken)
      await insertHashedLoginToken(userId, hashedTokenObj)
    }
    let sessionsObj = getSteedosSchema().getObject("sessions");
    let existingSessions = await sessionsObj.find({ filters: `(userId eq '${userId}') and (token eq '${authToken}')` });
    if (existingSessions && existingSessions.length > 0) {
      await sessionsObj.directUpdate(existingSessions[0]._id, { valid: true, modified: new Date() });
    } else {
      let sessionObj = {
          _id: await getSteedosSchema().getObject("users")._makeNewID(),
          userId: user._id,
          token: authToken,
          ip: null,
          userAgent: null,
          is_phone: false,
          is_tablet: false,
          login_expiration_in_days: null,
          user_provider: null,
          extraData: null,
          valid: true,
          created: new Date(),
          modified: new Date()
      }
      await sessionsObj.directInsert(sessionObj);
    }
    data = { userId: userId, authToken: authToken }
  }

  return data;
}

export const jwtSSO = async (req, res) => {
  try {
    let jwt = require('jsonwebtoken');
    let token = req.query.jwt_token;
    if (!token) {
      throw new Error('jwt_token is needed!')
    }
    let decoded = jwt.decode(token, { complete: true });
    let payload = decoded.payload;
    let issuer = payload.iss;
    if (!issuer) {
      throw new Error('issuer is needed!')
    }
    let collection = getSteedosSchema().getObject('OAuth2Clients')
    let clients = await collection.find({ filters: `clientId eq '${issuer}'` })
    let clientInfo = clients[0]
    let secret = clientInfo ? clientInfo.clientSecret : ''
    let spaceId = clientInfo ? clientInfo.space : ''
    if (!secret) {
      throw new Error('secret is needed!')
    }
    if (!spaceId) {
      throw new Error('spaceId is needed!')
    }
    let verifiedPayload = jwt.verify(token, secret);
    let data = await getTokenInfo({ user: verifiedPayload })
    setAuthCookies(req, res, data.userId, data.authToken, spaceId)
    let redirectUrl = verifiedPayload.redirect_url;
    if(redirectUrl && (redirectUrl.startsWith('https://') || redirectUrl.startsWith('http%3A%2F%2F'))){
      redirectUrl = decodeURIComponent(redirectUrl);
    }
    if(redirectUrl){
      redirectUrl = `/home/${spaceId}?redirect_uri=${encodeURIComponent(redirectUrl)}`
    }else{
      redirectUrl = `/home/${spaceId}`
    }
    res.redirect(302, redirectUrl);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message)
  }

}
