require('dotenv-flow').config();

import * as express from 'express';
import * as hbs from 'hbs';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import { init } from "./src";

var server = require('@steedos/meteor-bundle-runner');
var steedos = require('@steedos/core')
server.Fiber(function () {
    try {
        server.Profile.run("Server startup", function () {
            server.loadServerBundles();
            steedos.init();

            const app = express();
            app.engine('handlebars', hbs.__express);
            app.set('views', __dirname + '/src/saml-idp/views');
            app.set('view engine', 'hbs');
            app.set('view options', { layout: 'layout' })
            app.use(bodyParser.json());
            app.use(bodyParser.urlencoded({ extended: true }));
            app.use(cors({origin: true, credentials: true}));

            app.get('/', (req, res) => {
              res.redirect("/accounts/a");
              res.end();
            });

            init({app});

            server.callStartupHooks();
            server.runMain();
        })
    } catch (error) {
       console.error(error.stack)
    }
}).run()
