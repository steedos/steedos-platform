import { GraphQLSchema, GraphQLSchemaConfig } from "graphql";
import { SteedosSchema } from "../types";

export class ObjectQLSchema extends GraphQLSchema{
    constructor(steedosSchema: SteedosSchema){
        //...
        let config = new GraphQLSchemaConfig({

        })
        
        super(config)
    }
}