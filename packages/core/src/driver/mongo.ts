import { JsonMap, Dictionary } from "@salesforce/ts-types";
import { SteedosDriver } from "./index"
import { MongoClient } from "mongodb";
import { SteedosQueryOptions, SteedosQueryFilters } from "../types/query";
import { SteedosIDType } from "../types";

export class SteedosMongoDriver implements SteedosDriver {
    _url: string;
    _client: any;
    _collections: Dictionary<any>;
    
    constructor(url: string){
        this._collections = {};
        this._url = url;
    }

    async connect(){
        this._client = await MongoClient.connect(this._url, {useNewUrlParser: true})
    }

    disconnect(){
        return this._client.disconnect();
    }

    /* TODO： */
    getMongoFilters(filters: SteedosQueryFilters){
        return {_id: -1}
    }

    /* TODO： */
    getMongoOptions(filters: SteedosQueryOptions){
        return {
            projection: {_id: 1}
        }
    }

    collection(name: string) {
        if (!this._collections[name]) {
            this._collections[name] = this._client.db().collection(name);
        }
        return this._collections[name];
    };

    async find(tableName: string, query: SteedosQueryOptions){
       
        let collection = this.collection(tableName);

        let mongoFilters = this.getMongoFilters(query.filters);
        let mongoOptions = this.getMongoOptions(query);
        let result = await collection.find(mongoFilters, mongoOptions).toArray();

        return result;
    }

    async findOne(tableName: string, id: SteedosIDType, query: SteedosQueryOptions) {

        let collection = this.collection(tableName);
        let mongoOptions = this.getMongoOptions(query);

        let result = await collection.findOne({_id: id}, mongoOptions);

        return result;
    }

    async insert(tableName: string, data: JsonMap){

        let collection = this.collection(tableName);
        return await collection.insert(data);
    }

    async update(tableName: string, id: SteedosIDType, data: JsonMap){
        let collection = this.collection(tableName);
        return await collection.upset({_id: id}, data)
    }

    async delete(tableName: string, id: SteedosIDType){
        let collection = this.collection(tableName);
        return await collection.remove({_id: id})
    }

}