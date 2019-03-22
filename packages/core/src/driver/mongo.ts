import { JsonMap } from "@salesforce/ts-types";
import { SteedosDriver, SteedosDriverConfig } from "./index"
import { MongoClient } from "mongodb";
import { SteedosQueryOptions, SteedosQueryFilters } from "../types/query";

export class SteedosMongoDriver implements SteedosDriver {
    _connectionUri: SteedosDriverConfig;
    connected: boolean;
    private client: MongoClient;
    
    constructor(connectionUri: string){
        this._connectionUri = connectionUri;
        this.client = new MongoClient(connectionUri);
    }

    getMongoFilters(filters: SteedosQueryFilters){
        return {_id: -1}
    }

    async find(tableName: string, query: SteedosQueryOptions){
       
        await this.client.connect();
        this.connected = true;
        let db = this.client.db();
        let collection = db.collection(tableName);
        let mongoFilters = this.getMongoFilters(query.filters);
        let result = await collection.find(mongoFilters).toArray();
        this.client.close();
        this.connected = false;
        return result;
    }



    findOne(tableName: string, id: string | number, fields: [string]) {

    }

    insert(tableName: string, doc: JsonMap){

    }

    update(tableName: string, id:string|number, doc: JsonMap){

    }

    delete(tableName: string, id:string|number){

    }

}