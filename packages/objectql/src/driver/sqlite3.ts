import { SteedosColumnType } from "./index";
import { ConnectionOptions } from "typeorm";
import { SteedosDriverConfig } from "./driver";
import { SteedosTypeormDriver } from "../typeorm";
import { SQLLang } from 'odata-v4-sql';

export class SteedosSqlite3Driver extends SteedosTypeormDriver {
    getSupportedColumnTypes() {
        return [
            SteedosColumnType.varchar, 
            SteedosColumnType.text, 
            SteedosColumnType.number,
            SteedosColumnType.date,
            SteedosColumnType.dateTime,
            SteedosColumnType.oneToOne
        ]
    }
    
    sqlLang: SQLLang = SQLLang.Oracle;

    constructor(config: SteedosDriverConfig) {
        super(config);
    }

    getConnectionOptions(): ConnectionOptions {
        return {
            type: "sqlite",
            database: this._url,
            name: (new Date()).getTime().toString(),
            entities: Object.values(this._entities)
        };
    }
}