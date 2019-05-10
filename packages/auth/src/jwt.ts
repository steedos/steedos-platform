import { utils } from '@steedos/auth-utils';
import { getSteedosSchema } from '@steedos/objectql'
let express = require('express');
let jwt = require('express-jwt')

let app = express()

let secretCallback = async function (req, payload, done) {
  console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>payload: ', payload)
  let issuer = payload.iss
  let collection = getSteedosSchema().getObject('OAuth2Clients')
  let clientInfo = (await collection.find({ filters: `clientId eq '${issuer}'` }))[0]
  done(null, clientInfo ? clientInfo.clientSecret : '')
}

app.get('/api/jwt/sso', jwt({ secret: secretCallback }), async function (req, res) {
  let payload = req.user
  let data = { userId: '', authToken: '' }
  let userObj = getSteedosSchema().getObject('users')
  let user = (userObj.find({ filters: `username eq '${payload.username}'`, fields: ['_id'] }))[0]
  if (user) {
    let userId = user._id
    let authToken = payload.sessionId ? `${payload.iss}-${payload.username}-${payload.sessionId}` : `${payload.iss}-${payload.username}`
    let hashedToken = utils._hashLoginToken(authToken)
    if (await userObj.count({ filters: `services/resume/loginTokens/hashedToken eq '${hashedToken}'` })) {
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
  res.send(data)
})

export let jwtApp = app


