export const connectedApps = {
  sogo: {
    acsUrl: `https://mail.steedos.cn/SOGo/saml2-signon-post`,
    audience: `https://mail.steedos.cn/SOGo/saml2/artifactResponse`,
  },
  salesforce: {
    acsUrl: `https://mail.steedos.cn/SOGo/saml2-signon-post`,
    audience: `https://mail.steedos.cn/SOGo/saml2/artifactResponse`,
  },
  auth0: {
    issuer: "urn:auth0:hotlong:Steedos",
    acsUrl: `https://hotlong.auth0.com/login/callback?connection=Steedos`,
    audience: `urn:auth0:hotlong:Steedos`,
  }
}