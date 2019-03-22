import { JsonMap } from "@salesforce/ts-types";
import { SteedosDriver, SteedosDriverConfig } from "./index"
import { MongoClient } from "mongodb";
import { SteedosQueryOptions, SteedosQueryFilters } from "../types/query";

export class SteedosMongoDriver implements SteedosDriver {
    _url: SteedosDriverConfig;
    
    constructor(url: string){
        this._url = url;
    }


    connect(){
        return MongoClient.connect(this._url, {useNewUrlParser: true})
    }

    getMongoFilters(filters: SteedosQueryFilters){
        return {_id: -1}
    }

    async find(tableName: string, query: SteedosQueryOptions){
       
        let client = await this.connect();
        let db = client.db();
        let collection = db.collection(tableName);

        let mongoFilters = this.getMongoFilters(query.filters);
        let result = await collection.find(mongoFilters).toArray();

        client.close();
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