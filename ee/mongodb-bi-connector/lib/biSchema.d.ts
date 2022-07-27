import { ObjectId } from "mongodb";
export declare class SteedosBiSchema {
    private biSchema;
    append(objectConfigs: any[], dbName: any): this;
    toJson(): BiSchema;
}
declare class BiSchema {
    _id: ObjectId;
    created: Date;
    schema: Schema;
}
declare class Schema {
    databases: BiDatabase[];
}
declare class BiDatabase {
    name: string;
    tables: BiTable[];
    append(object: any): BiTable;
}
declare class BiTable {
    sql_name: string;
    mongo_name: string;
    pipeline: string;
    columns: BiColumn[];
}
declare class BiColumn {
    mongo_name: string;
    mongo_type: string;
    sql_name: string;
    sql_type: string;
}
/**
 *
 * @param biSchema
 * @param mongoUrl --schemaSource,
 */
export declare function setDefaultBiSchema(biSchema: BiSchema, mongoUrl: any): Promise<void>;
export {};
