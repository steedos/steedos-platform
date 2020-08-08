export const connectedApps = {
  sogo: {
    acsUrl: `https://mail.steedos.cn/SOGo/saml2-signon-post`,
    audience: `https://mail.steedos.cn/SOGo/saml2/artifactResponse`,
  },
  salesforce: {
    issuer: "http://192.168.0.50:4000/accounts/saml/",
    acsUrl: `https://steedos-dev-ed.my.salesforce.com?so=00D7F000000q6uO`,
    audience: `https://steedos-dev-ed.my.salesforce.com/`,
  },
  auth0: {
    issuer: "urn:auth0:hotlong:Steedos",
    acsUrl: `https://hotlong.auth0.com/login/callback?connection=Steedos`,
    audience: `urn:auth0:hotlong:Steedos`,
  }
}