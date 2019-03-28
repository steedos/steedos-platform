var objectql = require("@steedos/objectql")
var _ = require('underscore');
const graphqlHTTP = require('express-graphql');

let steedosSchema = new objectql.SteedosSchema({
    objects: {},
    datasource: {
        driver: 'mongo',
        url: 'mongodb://127.0.0.1/steedos'
    }
})

steedosSchema.use(__dirname + "/../standard-objects");
steedosSchema.use(__dirname + "/../../apps/crm/src");

steedosSchema.connect().then(function(){

    // 生成graphql schema
    let graphqlSchema = steedosSchema.buildGraphQLSchema()

    let express = require('express');
    let app = express();
    app.use(function(req, res, next){
        //TODO 处理userId
    })
    app.use('/graphql', graphqlHTTP({
        schema: graphqlSchema,
        graphiql: true
    }));
    app.listen(process.env.PORT || 3000)

});