// This file contains logic which is used when running this application as part of the
// OpenID Connect Conformance test suite. You can use it for inspiration, but please
// do not use it in production as is.

import {
  ConsentRequest,
  ConsentRequestSession,
  LoginRequest
} from '@oryd/hydra-client'

export const oidcConformityMaybeFakeAcr = (
  request: LoginRequest,
  fallback: string
) => {
  if (process.env.CONFORMITY_FAKE_CLAIMS !== '1') {
    return fallback
  }

  return request.oidc_context?.acr_values &&
    request.oidc_context.acr_values.length > 0
    ? request.oidc_context.acr_values[
        request.oidc_context.acr_values.length - 1
      ]
    : fallback
}

export const oidcConformityMaybeFakeSession = (
  grantScope: string[],
  request: ConsentRequest,
  session: ConsentRequestSession
): ConsentRequestSession => {
  if (process.env.CONFORMITY_FAKE_CLAIMS !== '1') {
    return session
  }

  const idToken: { [key: string]: any } = {}

  // If the email scope was granted, fake the email claims.
  if (grantScope.indexOf('email') > -1) {
    // But only do so if the email was requested!
    idToken.email = 'foo@bar.com'
    idToken.email_verified = true
  }

  // If the phone scope was granted, fake the phone claims.
  if (grantScope.indexOf('phone') > -1) {
    idToken.phone_number = '1337133713371337'
    idToken.phone_number_verified = true
  }

  // If the profile scope was granted, fake the profile claims.
  if (grantScope.indexOf('profile') > -1) {
    idToken.name = 'Foo Bar'
    idToken.given_name = 'Foo'
    idToken.family_name = 'Bar'
    idToken.website = 'https://www.ory.sh'
    idToken.zoneinfo = 'Europe/Belrin'
    idToken.birthdate = '1.1.2014'
    idToken.gender = 'robot'
    idToken.profile = 'https://www.ory.sh'
    idToken.preferred_username = 'robot'
    idToken.middle_name = 'Baz'
    idToken.locale = 'en-US'
    idToken.picture =
      'https://raw.githubusercontent.com/ory/web/master/static/images/favico.png'
    idToken.updated_at = 1604416603
    idToken.nickname = 'foobot'
  }

  // If the address scope was granted, fake the address claims.
  if (grantScope.indexOf('address') > -1) {
    idToken.address = {
      country: 'Localhost',
      region: 'Intranet',
      street_address: 'Local Street 1337'
    }
  }

  return {
    access_token: session.access_token,
    id_token: {
      ...idToken,
      ...session.id_token
    }
  }
}
