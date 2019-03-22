var server = require('@steedos/meteor-bundle-runner');
// import { default as Project } from "./src/project/Project";
import { ODataRouter, use } from './src';
declare var WebApp: any;
declare var Creator: any;
var _ = require('underscore');
const graphqlHTTP = require('express-graphql');

server.Fiber(function () {
    server.Profile.run("Server startup", function () {
        server.loadServerBundles();
        server.callStartupHooks();
        try {
            use(__dirname + "/../standard-objects");
            use(__dirname + "/../../apps/crm/src");
            // use(__dirname + "/../../apps/app-meeting");

            // 生成graphql schema
            let utils = require('./src/graphql/utils');
            let MyGraphQLSchema = utils.makeSchema(_.values(Creator.Objects));

            let express = require('express');
            let app = express();
            app
                .use('/api/odata/v2', ODataRouter)
                .disable('x-powered-by')
                .use('/assets/stimulsoft-report/', express.static(__dirname + '/node_modules/@steedos/stimulsoft-report/assets/'))
            app.use('/graphql', graphqlHTTP({
                schema: MyGraphQLSchema,
                graphiql: true,
                context: { db: Creator.getCollection('users').rawDatabase() }
            }));
            WebApp.connectHandlers.use(app);
        } catch (error) {
            console.error(error)
            throw error
        }
        //require("../../apps/crm/src")
        server.runMain();
    });
}).run();