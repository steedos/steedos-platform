import { SteedosFieldDBType } from "./index";
import { ConnectionOptions, EntitySchema } from "typeorm";
import { SteedosDriverConfig } from "./driver";
import { SteedosTypeormDriver } from "../typeorm";
import { Dictionary } from "@salesforce/ts-types";
import { SteedosObjectType } from "../types";
import { SQLLang } from 'odata-v4-sql';
import { getEntities } from "../typeorm";

export class SteedosMySqlDriver extends SteedosTypeormDriver {
    getSupportedColumnTypes() {
        return [
            SteedosFieldDBType.varchar,
            SteedosFieldDBType.text,
            SteedosFieldDBType.number,
            SteedosFieldDBType.boolean,
            SteedosFieldDBType.date,
            SteedosFieldDBType.dateTime
        ]
    }

    sqlLang: SQLLang = SQLLang.MySql;

    constructor(config: SteedosDriverConfig) {
        super(config);
    }

    getConnectionOptions(): ConnectionOptions {
        return  {
            type: "mysql",
            url: this._url,
            name: (new Date()).getTime().toString(),
            entities: Object.values(this._entities),
            host: this.config.host,
            port: this.config.port,
            username: this.config.username,
            password: this.config.password,
            database: this.config.database,
            timezone: this.config.timezone,
            logging: this.config.logging
        };
    }

    getEntities(objects: Dictionary<SteedosObjectType>): Dictionary<EntitySchema> {
        return getEntities(objects, "mssql");
    }
}