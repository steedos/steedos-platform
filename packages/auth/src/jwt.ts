import { utils } from './utils';
import { getSteedosSchema } from '@steedos/objectql'
let express = require('express');
let jwt = require('express-jwt');

let router = express.Router();

function secretCallback(req, payload, done) {
  let issuer = payload.iss
  let collection = getSteedosSchema().getObject('OAuth2Clients')
  collection.find({ filters: `clientId eq '${issuer}'` }).then(function (resolve) {
    let clientInfo = resolve[0]
    let clientSecret = clientInfo ? clientInfo.clientSecret : ''
    done(null, clientSecret)
  }).catch(function (reject) {
    done(reject, '')
  })
}

async function getTokenInfo(req) {
  let payload = req.user
  let data = { userId: '', authToken: '' }
  let userObj = getSteedosSchema().getObject('users')
  let user = (await userObj.find({ filters: `username eq '${payload.username}'`, fields: ['_id'] }))[0]
  if (user) {
    let userId = user._id
    let authToken = payload.sessionId ? `${payload.iss}-${payload.username}-${payload.sessionId}` : `${payload.iss}-${payload.username}`
    let hashedToken = utils._hashLoginToken(authToken).replace(/\//g, '%2F');
    let filters = `(services/resume/loginTokens/hashedToken eq '${hashedToken}')`;
    if (await userObj.count({ filters: filters })) {
      data = { userId: userId, authToken: authToken }
    } else {
      let stampedToken = {
        token: authToken,
        when: new Date
      }
      let hashedTokenObj = utils._hashStampedToken(stampedToken)
      await utils._insertHashedLoginToken(userId, hashedTokenObj)

      data = { userId: userId, authToken: authToken }
    }
  }

  return data;
}

router.get('/jwt/getToken', jwt({ secret: secretCallback }), async function (req, res) {
  let data = await getTokenInfo(req)
  res.send(data)
})

router.get('/jwt/sso', jwt({ secret: secretCallback }), async function (req, res) {
  let data = await getTokenInfo(req);
  res.cookie('X-User-Id', data.userId, { maxAge: 90 * 60 * 60 * 24 * 1000, httpOnly: true });
  res.cookie('X-Auth-Token', data.authToken, { maxAge: 90 * 60 * 60 * 24 * 1000, httpOnly: true });
  let payload = req.user;
  let redirectUrl = payload.redirect_url;
  res.redirect(301, redirectUrl);
})

export let jwtRouter = router


