var objectql = require("@steedos/objectql")
var _ = require('underscore');
const graphqlHTTP = require('express-graphql');

// const schemaConfig = require(process.cwd() + '/steedos.config.js')

let steedosSchema = new objectql.SteedosSchema({
    datasources: {
        default: {
            driver: 'mongo',
            url: 'mongodb://127.0.0.1/steedos',
            objectFiles: [__dirname + "/../standard-objects", __dirname + "/../../apps/crm/src"]
        }
    },
})
let express = require('express');
let app = express();
app.use(function (req, res, next) {
    //TODO 处理userId
    next();
})

_.each(steedosSchema.getDataSources(), function (datasource, name) {
    app.use(`/graphql/${name}`, graphqlHTTP({
        schema: datasource.buildGraphQLSchema(),
        graphiql: true
    }));
})


app.listen(process.env.PORT || 3000)