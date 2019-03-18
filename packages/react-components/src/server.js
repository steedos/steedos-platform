import App from './App';
import React from 'react';
import { StaticRouter } from 'react-router-dom';
import express from 'express';
import { renderToString } from 'react-dom/server';
import ReportRoutes from './routes/report';

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const server = express();
server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .use('/assets/', express.static(`${__dirname}/../node_modules/@salesforce-ux/design-system/assets/`))
  .use('/assets/stimulsoft/', express.static(`${__dirname}/../src/components/stimulsoft/`))
  .use('/api/v2/reports', ReportRoutes)
  .get('/*', (req, res) => {
    const context = {};
    const markup = renderToString(
      <StaticRouter context={context} location={req.url}>
        <App />
      </StaticRouter>
    );

    if (context.url) {
      res.redirect(context.url);
    } else {
      res.status(200).send(
        `<!doctype html>
          <html lang="">
          <head>
              <meta http-equiv="X-UA-Compatible" content="IE=edge" />
              <meta charset="utf-8" />
              <title>Welcome to Steedos</title>
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <!-- <link rel="stylesheet" href="/assets/styles/salesforce-lightning-design-system.css"> -->
              <link href="/assets/stimulsoft/css/stimulsoft.viewer.office2013.whiteblue.css" rel="stylesheet">
              <link href="/assets/stimulsoft/css/stimulsoft.designer.office2013.whiteblue.css" rel="stylesheet">
              <script src="/assets/stimulsoft/js/stimulsoft.reports.js" type="text/javascript"></script>
              <script src="/assets/stimulsoft/js/stimulsoft.dashboards.js" type="text/javascript"></script>
              <script src="/assets/stimulsoft/js/stimulsoft.viewer.js" type="text/javascript"></script>
              <script src="/assets/stimulsoft/js/stimulsoft.designer.js" type="text/javascript"></script>
              ${
                assets.client.css
                  ? `<link rel="stylesheet" href="${assets.client.css}">`
                  : ''
              }
              ${
                process.env.NODE_ENV === 'production'
                  ? `<script src="${assets.client.js}" defer></script>`
                  : `<script src="${assets.client.js}" defer crossorigin></script>`
              }
          </head>
          <body>
              <div id="root">${markup}</div>
          </body>
        </html>`
      );
    }
  });

export default server;
