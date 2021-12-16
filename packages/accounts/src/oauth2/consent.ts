import * as express from 'express'
import * as url from 'url'
import { hydraAdmin } from './config'
import { oidcConformityMaybeFakeSession } from './stub/oidc-cert'
import { ConsentRequestSession } from '@oryd/hydra-client'
const _ = require('lodash');
const csrf = require('csurf');
const urljoin = require('url-join');
const pug = require('pug');
const path = require('path');
// Sets up csrf protection
const csrfProtection = csrf({ cookie: true })
const router = express.Router()
declare const Meteor;

const getOAuthSession = (user, grantScope) => {
  // The session allows us to set session data for id and access tokens
  let session: ConsentRequestSession = {
    // This data will be available when introspecting the token. Try to avoid sensitive information here,
    // unless you limit who can introspect tokens.
    access_token: {
      // foo: 'bar'
    },

    // This data will be available in the ID token.
    id_token: {
      // baz: 'bar'
    }
  }
  let _grantScope = grantScope
  if (!_.isArray(_grantScope)) {
    _grantScope = [_grantScope];
  }
  _.each(_grantScope, (scope) => {
    if (scope === 'profile') {
      (session.id_token as any).steedos_id = user.steedos_id;
      (session.id_token as any).name = user.name;
      (session.id_token as any).username = user.username;
      (session.id_token as any).mobile = user.mobile;
      (session.id_token as any).email = user.email;
      // (session.id_token as any).job_number = user.job_number;
      (session.id_token as any).locale = user.locale;
      (session.id_token as any).space = user.spaces && user.spaces.length > 0 ? user.spaces[0] : null;
      // (session.id_token as any).profile = user.profile;
      (session.id_token as any).userId = user.userId;
      (session.id_token as any).mobile_verified = user.mobile_verified;
      (session.id_token as any).email_verified = user.email_verified;
      (session.id_token as any).utcOffset = user.utcOffset;
    }
  })

  return session;
}

router.get('/', csrfProtection, (req, res, next) => {
  // Parses the URL query
  const query = url.parse(req.url, true).query

  // The challenge is used to fetch information about the consent request from ORY hydraAdmin.
  const challenge = String(query.consent_challenge)
  if (!challenge) {
    next(new Error('Expected a consent challenge to be set but received none.'))
    return
  }
  const user = (req as any).user
  if (!user) {
    return res.redirect("/accounts/a/#/login?redirect_uri=" + encodeURIComponent(Meteor.absoluteUrl(`/oauth2/consent?consent_challenge=${challenge}`)))
  }
  // This section processes consent requests and either shows the consent UI or
  // accepts the consent request right away if the user has given consent to this
  // app before
  (hydraAdmin
    .getConsentRequest(challenge) as any)
    // This will be called if the HTTP request was successful
    .then(({ data: body }) => {
      // If a user has granted this application the requested scope, hydra will tell us to not show the UI.
      if (body.skip) {
        // You can apply logic here, for example grant another scope, or do whatever...
        // ...

        // Now it's time to grant the consent request. You could also deny the request if something went terribly wrong
        return hydraAdmin
          .acceptConsentRequest(challenge, {
            // We can grant all scopes that have been requested - hydra already checked for us that no additional scopes
            // are requested accidentally.
            grant_scope: body.requested_scope,

            // ORY Hydra checks if requested audiences are allowed by the client, so we can simply echo this.
            grant_access_token_audience: body.requested_access_token_audience,

            // The session allows us to set session data for id and access tokens
            session: getOAuthSession(user, body.requested_scope)
          })
          .then(({ data: body }) => {
            // All we need to do now is to redirect the user back to hydra!
            res.redirect(String(body.redirect_to))
          })
      }

      // If consent can't be skipped we MUST show the consent UI.
      // return res.status(200).send({
      //   csrfToken: (req as any).csrfToken(),
      //   challenge: challenge,
      //   // We have a bunch of data available from the response, check out the API docs to find what these values mean
      //   // and what additional data you have available.
      //   requested_scope: body.requested_scope,
      //   user: body.subject,
      //   client: body.client,
      //   action: urljoin(process.env.BASE_URL || '', '/consent')
      // })
      var fn = pug.compileFile(path.join(__dirname, '..', '..', './views/oauth2/consent.pug'), {});
      return res.status(200).send(fn({
        csrfToken: (req as any).csrfToken(),
        challenge: challenge,
        // We have a bunch of data available from the response, check out the API docs to find what these values mean
        // and what additional data you have available.
        requested_scope: body.requested_scope,
        user: body.subject,
        userInfo: user,
        client: body.client,
        action: Meteor.absoluteUrl(`/oauth2/consent`)
      }));
    })
    // This will handle any error that happens when making HTTP calls to hydra
    .catch(next)
  // The consent request has now either been accepted automatically or rendered.
})

router.post('/', csrfProtection, (req, res, next) => {
  const user = (req as any).user

  // The challenge is now a hidden input field, so let's take it from the request body instead
  const challenge = req.body.challenge
  if (!challenge) {
    next(new Error('Expected a consent challenge to be set but received none.'))
    return
  }
  if (!user) {
    return res.redirect("/accounts/a/#/login?redirect_uri=" + encodeURIComponent(Meteor.absoluteUrl(`/oauth2/consent?consent_challenge=${challenge}`)))
  }

  // Let's see if the user decided to accept or reject the consent request..
  if (req.body.submit === 'Deny access') {
    // Looks like the consent request was denied by the user
    return (
      hydraAdmin
        .rejectConsentRequest(challenge, {
          error: 'access_denied',
          error_description: 'The resource owner denied the request'
        })
        .then(({ data: body }) => {
          // All we need to do now is to redirect the browser back to hydra!
          res.redirect(String(body.redirect_to))
        })
        // This will handle any error that happens when making HTTP calls to hydra
        .catch(next)
    )
  }
  // label:consent-deny-end

  let grantScope = req.body.grant_scope
  if (!Array.isArray(grantScope)) {
    grantScope = [grantScope]
  }

  // The session allows us to set session data for id and access tokens
  let session: ConsentRequestSession = getOAuthSession(user, grantScope)

  // Let's fetch the consent request again to be able to set `grantAccessTokenAudience` properly.
  hydraAdmin
    .getConsentRequest(challenge)
    // This will be called if the HTTP request was successful
    .then(({ data: body }) => {
      return hydraAdmin
        .acceptConsentRequest(challenge, {
          // We can grant all scopes that have been requested - hydra already checked for us that no additional scopes
          // are requested accidentally.
          grant_scope: grantScope,

          // If the environment variable CONFORMITY_FAKE_CLAIMS is set we are assuming that
          // the app is built for the automated OpenID Connect Conformity Test Suite. You
          // can peak inside the code for some ideas, but be aware that all data is fake
          // and this only exists to fake a login system which works in accordance to OpenID Connect.
          //
          // If that variable is not set, the session will be used as-is.
          session: oidcConformityMaybeFakeSession(grantScope, body, session),

          // ORY Hydra checks if requested audiences are allowed by the client, so we can simply echo this.
          grant_access_token_audience: body.requested_access_token_audience,

          // This tells hydra to remember this consent request and allow the same client to request the same
          // scopes from the same user, without showing the UI, in the future.
          remember: Boolean(req.body.remember),

          // When this "remember" sesion expires, in seconds. Set this to 0 so it will never expire.
          remember_for: 3600
        })
        .then(({ data: body }) => {
          // All we need to do now is to redirect the user back to hydra!
          res.redirect(String(body.redirect_to))
        })
    })
    // This will handle any error that happens when making HTTP calls to hydra
    .catch(next)
  // label:docs-accept-consent
})

export default router
