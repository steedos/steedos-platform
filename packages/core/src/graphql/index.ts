import { GraphQLSchema } from "graphql";
import { SteedosSchema } from "../types";
import { makeGraphQLSchemaConfig } from './utils';


/*
    var query = '{  }';
    schema  = new ObjectQLSchema()

    graphql(schema, query).then(result => {
        console.log(result);
    });

*/
export class ObjectQLSchema extends GraphQLSchema {
    private _steedosSchema: SteedosSchema;

    constructor(steedosSchema: SteedosSchema) {

        super(makeGraphQLSchemaConfig(steedosSchema.objects));

        this._steedosSchema = steedosSchema;
    }

    public get steedosSchema(): SteedosSchema {
        return this._steedosSchema;
    }
    public set steedosSchema(value: SteedosSchema) {
        this._steedosSchema = value;
    }




}