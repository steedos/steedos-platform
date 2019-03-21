const express = require('express');
const graphql = require('graphql');
const graphqlHTTP = require('express-graphql');
const utils = require('../../lib/graphql/utils');


const customerObject = {
  name: 'reports',
  fields: {
    name: {
      type: 'text'
    },
    report_type: {
      type: 'text'
    }
  }
}

const MyGraphQLSchema = utils.makeSchema(customerObject)

console.log(graphql.printSchema(MyGraphQLSchema));

const app = express();
app.use('/graphql', graphqlHTTP({
  schema: MyGraphQLSchema,
  graphiql: true
}));

utils.connectToDatabase().then(function (r) {
  app.listen({
      port: 4000
    }, () =>
    console.log(`🚀 Server ready at http://localhost:4000/graphql`)
  );
})