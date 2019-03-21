import { JsonMap } from "@salesforce/ts-types";
import DataSource from "./DataSource";
import DataSourceConfig from "./DataSourceConfig";
import DataSourceQueryOptions from "./DataSourceQueryOptions";
import { MongoClient, Db } from "mongodb";
import assert = require('assert');

export default class MongoDataSource extends DataSource {
    config: DataSourceConfig;
    connected: boolean;
    private client: MongoClient;
    private db: Db;
    
    constructor(config: DataSourceConfig){
        super(config);
        this.config = config;
        this.client = new MongoClient(config.connectionUri);
        this.client.connect((err) => {
            assert.equal(null, err);
            console.log("Connected successfully to server===1");
            this.connected = true;
            // this.db = this.client.db(this.config.name);
            this.client.close();
            this.connected = false;
        });
    }

    private findDocuments(tableName: string, filters: [[string]], fields: [string], options: DataSourceQueryOptions, callback: any){
        this.db = this.client.db(this.config.name);
        const collection = this.db.collection(tableName);
        collection.find({}).toArray((err, docs)=> {
            console.log("==findDocuments======err====", err);
            assert.equal(err, null);
            console.log("Found the following records");
            console.log(docs)
            callback(docs);
        });
    }

    // static getDefaultDataSource() {
    //     return defaultDataSource
    // }
    
    find(tableName: string, filters: [[string]], fields: [string], options: DataSourceQueryOptions){
        console.log("find==============");
        this.client.connect((err)=> {
            assert.equal(null, err);
            console.log("Connected successfully to server===2");
            this.connected = true;
            this.findDocuments(tableName, filters, fields, options, ()=> {
                console.log("==callback===============");
                this.client.close();
            });
        });
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

