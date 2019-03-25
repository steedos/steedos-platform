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
            let SteedosSchema = require('@steedos/core/lib/types').SteedosSchema;
            let mySchema = new SteedosSchema({
                objects: {},
                datasource: {
                    driver: 'mongo',
                    url: 'mongodb://127.0.0.1/steedos'
                }
            })

            mySchema.use(__dirname + "/../standard-objects");
            mySchema.use(__dirname + "/../../apps/crm/src");

            // 生成graphql schema
            let ObjectQLSchema = require('@steedos/core/lib/graphql').ObjectQLSchema;
            let MyObjectQLSchema = new ObjectQLSchema(mySchema);

            let express = require('express');
            let app = express();
            app
                .use('/api/odata/v2', steedos.ODataRouter)
                .disable('x-powered-by')
                .use('/assets/stimulsoft-report/', express.static(__dirname + '/node_modules/@steedos/stimulsoft-report/assets/'))
            app.use('/graphql', graphqlHTTP({
                schema: MyObjectQLSchema,
                graphiql: true,
                context: {
                    steedosSchema: MyObjectQLSchema.steedosSchema
                }
            }));
            WebApp.connectHandlers.use(app);
        } catch (error) {
            console.error(error)
            throw error
        }

        server.runMain();
    });
}).run();