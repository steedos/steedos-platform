import { SteedosColumnType } from "./index";
import { ConnectionOptions } from "typeorm";
import { SteedosDriverConfig } from "./driver";
import { SteedosTypeormDriver } from "../typeorm";
import { Dictionary } from "@salesforce/ts-types";
import { SteedosObjectType } from "../types";

export class SteedosSqlServerDriver extends SteedosTypeormDriver {
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

    constructor(config: SteedosDriverConfig) {
        super(config);
    }

    getConnectionOptions(): ConnectionOptions {
        return  {
            type: "mssql",
            url: this._url,
            name: (new Date()).getTime().toString(),
            entities: Object.values(this._entities),
            username: this.config.username,
            password: this.config.password,
            database: this.config.database
        };
    }

    async createTables(objects: Dictionary<SteedosObjectType>) {
        this.registerEntities(objects);
        await this.connect();
        // await this._client.synchronize();
    }
}