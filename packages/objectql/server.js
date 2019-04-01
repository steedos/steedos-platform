var objectql = require("@steedos/objectql")
var _ = require('underscore');
const graphqlHTTP = require('express-graphql');

// const schemaConfig = require(process.cwd() + '/steedos.config.js')

let steedosSchema = new objectql.SteedosSchema({
    datasources: {
        localMongo: {
            driver: 'mongo',
            url: 'mongodb://127.0.0.1/steedos',
            objectFiles: [__dirname + "/../standard-objects", __dirname + "/../../apps/crm/src"]
        }
    },
})

// 生成graphql schema
let graphqlSchema = steedosSchema.buildGraphQLSchema()

let express = require('express');
let app = express();
app.use(function(req, res, next){
    //TODO 处理userId
    next();
})
app.use('/graphql', graphqlHTTP({
    schema: graphqlSchema,
    graphiql: true
}));
app.listen(process.env.PORT || 3000)
