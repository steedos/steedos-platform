import { JsonMap } from "@salesforce/ts-types";
import DataSource from "./DataSource";
import DataSourceConfig from "./DataSourceConfig";
import DataSourceQueryOptions from "./DataSourceQueryOptions";
import { MongoClient, Db } from "mongodb";

export default class MongoDataSource extends DataSource {
    config: DataSourceConfig;
    connected: boolean;
    private client: MongoClient;
    private db: Db;
    
    constructor(config: DataSourceConfig){
        super(config);
        this.config = config;
        this.client = new MongoClient(config.connectionUri);
        console.log(`Connecting Mongodb for ${this.config.name}...`);
        this.client.connect().then((error) => {
            if(error){
                console.error(`Connected Mongodb failed for ${this.config.name}, the error is:`, error);
            }
            else {
                this.connected = true;
                this.client.close();
                this.connected = false;
                console.log(`Connected Mongodb for ${this.config.name} successfully`);
            }
        });
    }

    private async findDocuments(tableName: string, filters: [[string]], fields: [string], options: DataSourceQueryOptions){
        this.db = this.client.db(this.config.name);
        const collection = this.db.collection(tableName);
        let result = await collection.find({}).toArray();
        console.log("Found the following records");
        console.log(result)
        return result;
    }

    // static getDefaultDataSource() {
    //     return defaultDataSource
    // }
    
    async find(tableName: string, filters: [[string]], fields: [string], options: DataSourceQueryOptions){
        try {
            console.log(`Connecting Mongodb for ${this.config.name}...`);
            await this.client.connect();
            console.log(`Connected Mongodb for ${this.config.name} successfully`);
            this.connected = true;
            let result = await this.findDocuments(tableName, filters, fields, options);
            this.client.close();
            this.connected = false;
            return result;
        }
        catch (err) {
            console.error(`Connected Mongodb failed for ${this.config.name}, the error is:`, err);
        }
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

// let defaultDataSource = new MongoDataSource( {
//     name: "default", 
//     type: "mongodb", 
//     connectionUri: "mongodb://127.0.0.1/steedos"
// });

