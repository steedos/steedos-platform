import { JsonMap } from "@salesforce/ts-types";
import { SteedosDriver } from "./index"
import { MongoClient } from "mongodb";
import { SteedosQueryOptions, SteedosQueryFilters } from "../types/query";
import { SteedosIDType } from "../types";

export class SteedosMongoDriver implements SteedosDriver {
    _url: string;
    
    constructor(url: string){
        this._url = url;
    }


    connect(){
        return MongoClient.connect(this._url, {useNewUrlParser: true})
    }

    getMongoFilters(filters: SteedosQueryFilters){
        return {_id: -1}
    }

    getMongoOptions(filters: SteedosQueryOptions){
        return {
            projection: {_id: 1}
        }
    }

    async find(tableName: string, query: SteedosQueryOptions){
       
        let client = await this.connect();
        let collection = client.db().collection(tableName);

        let mongoFilters = this.getMongoFilters(query.filters);
        let mongoOptions = this.getMongoOptions(query);
        let result = await collection.find(mongoFilters, mongoOptions).toArray();

        client.close();
        return result;
    }

    async findOne(tableName: string, id: SteedosIDType, query: SteedosQueryOptions) {

        let client = await this.connect();
        let collection = client.db().collection(tableName);
        let mongoOptions = this.getMongoOptions(query);

        let result = await collection.findOne({_id: id}, mongoOptions);

        client.close();
        return result;
    }

    insert(tableName: string, doc: JsonMap){

    }

    update(tableName: string, id: SteedosIDType, doc: JsonMap){

    }

    delete(tableName: string, id: SteedosIDType){

    }

}