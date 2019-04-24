import { SteedosColumnType } from "./index";
import { ConnectionOptions, EntitySchema } from "typeorm";
import { SteedosDriverConfig } from "./driver";
import { SteedosTypeormDriver, getEntities } from "../typeorm";
import { SQLLang } from 'odata-v4-sql';
import { Dictionary } from "@salesforce/ts-types";
import { SteedosObjectType } from "../types";

export class SteedosSqlite3Driver extends SteedosTypeormDriver {
    getSupportedColumnTypes() {
        return [
            SteedosColumnType.varchar, 
            SteedosColumnType.text, 
            SteedosColumnType.number,
            SteedosColumnType.boolean,
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

    getEntities(objects: Dictionary<SteedosObjectType>): Dictionary<EntitySchema> {
        return getEntities(objects, "sqlite");
    }
}