import { samlIdp } from './express-middleware';
import { spawn } from 'child_process';
const { connectedApps } = require("./connectedApps");

const issuer = process.env.ROOT_URL?process.env.ROOT_URL:'http://127.0.0.1:4000/';
const app = connectedApps["salesforce"];

// samlIdp.run({
//   issuer: app.issuer,
//   acsUrl: app.acsUrl,
//   audience: app.audience,
// });

export default samlIdp.expressMiddleware;