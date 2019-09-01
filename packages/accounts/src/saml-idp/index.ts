import { samlIdp } from './express-middleware';
const { connectedApps } = require("./connectedApps");

const issuer = process.env.ROOT_URL?process.env.ROOT_URL:'http://127.0.0.1:4000/';
const app = connectedApps["mail"];

samlIdp.run({
  issuer: issuer,
  acsUrl: app.acsUrl,
  audience: app.audience
});

export default samlIdp.expressMiddleware;