var server = require('@steedos/meteor-bundle-runner');
// import { default as Project } from "./src/project/Project";
var steedos = require("@steedos/core")

var _ = require('underscore');
const graphqlHTTP = require('express-graphql');

server.Fiber(function () {
    server.Profile.run("Server startup", function () {
        server.loadServerBundles();
        server.callStartupHooks();
        try {
            steedos.use(__dirname + "/../standard-objects");
            steedos.use(__dirname + "/../../apps/crm/src");

            // 生成graphql schema
            let utils = require('@steedos/core/lib/graphql/utils');
            let MyGraphQLSchema = utils.makeSchema(_.values(Creator.Objects));

            let express = require('express');
            let app = express();
            app
                .use('/api/odata/v2', steedos.ODataRouter)
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
        
        server.runMain();
    });
}).run();