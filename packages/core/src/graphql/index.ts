import { GraphQLSchema, GraphQLSchemaConfig } from "graphql";
import { SteedosSchema } from "../types";


/*
    var query = '{  }';
    schema  = new ObjectQLSchema()

    graphql(schema, query).then(result => {
        console.log(result);
    });

*/
export class ObjectQLSchema extends GraphQLSchema{
    constructor(steedosSchema: SteedosSchema){
        //...
        let config = new GraphQLSchemaConfig({

        })
        
        super(config)
    }
}