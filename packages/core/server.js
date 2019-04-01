var SteedosSchema = require("@steedos/objectql").SteedosSchema
var _ = require('underscore');
const graphqlHTTP = require('express-graphql');


let getRolesfromCreator = async (userId)=>{
    console.log(`get ${userId} roles`);
    var roles = ['user']
    // if(isSpaceAdmin(userId)){
    //     roles.push('admin')
    // }
    let userRoles = await steedosSchema.getObject("permission_set").find({filters: `users eq '${userId}'`, fields: ['_id', 'name']})
    if(userRoles){
        userRoles.forEach((role) => {
            roles.push(role.name)
        });
    }
    return roles
}

let steedosSchema = new SteedosSchema({
    datasources: {
        localMongo: {
            driver: 'mongo',
            url: 'mongodb://127.0.0.1/steedos',
            objectFiles: [__dirname + "/../standard-objects", __dirname + "/../../apps/crm/src"]
        }
    },
    getRoles: getRolesfromCreator
})


// 生成graphql schema
let graphqlSchema = steedosSchema.buildGraphQLSchema()

let express = require('express');
let app = express();

app.use(function(req, res, next){
    //TODO 处理userId
    // req.userId = '5199da558e296a4ba0000001'
    next();
})

app.use('/graphql', graphqlHTTP({
    schema: graphqlSchema,
    graphiql: true
}));
app.listen(process.env.PORT || 3000)
