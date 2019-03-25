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
            let steedosSchema = new steedos.SteedosSchema({
                objects: {},
                datasource: {
                    driver: 'mongo',
                    url: 'mongodb://127.0.0.1/steedos'
                }
            })

            steedosSchema.use(__dirname + "/../standard-objects");
            steedosSchema.use(__dirname + "/../../apps/crm/src");

            steedosSchema.connect().then(function(){

                let graphqlSchema = steedos.buildGraphQLSchema(steedosSchema)

                // 生成graphql schema
    
                let express = require('express');
                let app = express();
                app
                    .use('/api/odata/v2', steedos.ODataRouter)
                    .disable('x-powered-by')
                    .use('/assets/stimulsoft-report/', express.static(__dirname + '/node_modules/@steedos/stimulsoft-report/assets/'))
                app.use('/graphql', graphqlHTTP({
                    schema: graphqlSchema,
                    graphiql: true
                }));
                WebApp.connectHandlers.use(app);
            })

        } catch (error) {
            console.error(error)
            throw error
        }

        server.runMain();
    });
}).run();