import { JsonMap } from "@salesforce/ts-types";
import { SteedosDriver, SteedosDriverConfig, SteedosDriverFindOptions } from "./index"
import { MongoClient, Db } from "mongodb";

export class SteedosMongoDriver implements SteedosDriver {
    _connectionUri: SteedosDriverConfig;
    connected: boolean;
    private client: MongoClient;
    private db: Db;
    
    constructor(connectionUri: string){
        this._connectionUri = connectionUri;
        this.client = new MongoClient(connectionUri);
    }

    private async findDocuments(tableName: string, filters: [[string]], fields: [string], options: SteedosDriverFindOptions){
        this.db = this.client.db();
        const collection = this.db.collection(tableName);
        let result = await collection.find({}).toArray();
        return result;
    }

    async find(tableName: string, filters: [[string]], fields: [string], options: SteedosDriverFindOptions){
       
        await this.client.connect();
        this.connected = true;
        let result = await this.findDocuments(tableName, filters, fields, options);
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