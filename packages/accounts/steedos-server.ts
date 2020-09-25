require('dotenv-flow').config();

import * as express from 'express';
import * as hbs from 'hbs';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import { init } from "./src";
import { isMeteor } from '@steedos/objectql';
const initConfig = require("@steedos/core/lib/init/init-config.json");

var server = require('@steedos/meteor-bundle-runner');
var steedos = require('@steedos/core')

declare var Meteor;

server.Fiber(function () {
    try {
        server.Profile.run("Server startup", function () {
            server.loadServerBundles();

            initConfig.built_in_plugins = ["@steedos/steedos-plugin-workflow"]

            steedos.init();

            server.callStartupHooks();

            const app = express();
            app.engine('handlebars', hbs.__express);
            app.set('views', __dirname + '/src/saml-idp/views');
            app.set('view engine', 'hbs');
            app.set('view options', { layout: 'layout' })
            app.use(bodyParser.json());
            app.use(bodyParser.urlencoded({ extended: true }));
            app.use(cors({origin: true, credentials: true}));

            init({app: app, settings: Meteor.settings});

            server.runMain();
        })
    } catch (error) {
       console.error(error.stack)
    }
}).run()
