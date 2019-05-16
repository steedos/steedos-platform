import { SteedosFieldDBType } from "./index";
import { ConnectionOptions, EntitySchema } from "typeorm";
import { SteedosDriverConfig } from "./driver";
import { SteedosTypeormDriver } from "../typeorm";
import { Dictionary } from "@salesforce/ts-types";
import { SteedosObjectType } from "../types";
import { SQLLang } from 'odata-v4-sql';
import { getEntities } from "../typeorm";

export class SteedosOracleDriver extends SteedosTypeormDriver {
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

    sqlLang: SQLLang = SQLLang.Oracle;

    constructor(config: SteedosDriverConfig) {
        super(config);
        if (!process.env.ORA_SDTZ) {
            // 设置日期/时间字段默认时区为UTC
            process.env.ORA_SDTZ = 'UTC';
        }
    }

    getConnectionOptions(): ConnectionOptions {
        return  {
            type: "oracle",
            url: this._url,
            name: (new Date()).getTime().toString(),
            entities: Object.values(this._entities),
            username: this.config.username,
            password: this.config.password,
            database: this.config.database,
            connectString: this.config.connectString ,
            logging: this.config.logging
        };
    }

    async createTables(objects: Dictionary<SteedosObjectType>) {
        this.registerEntities(objects);
        await this.connect();
        // await this._client.synchronize();
    }

    getEntities(objects: Dictionary<SteedosObjectType>): Dictionary<EntitySchema> {
        return getEntities(objects, "oracle");
    }

    async getDatabaseVersion() {
        let result = await this.run(`select version from sys.product_component_version where product like '%Oracle%'`);
        return result.length && result[0] && result[0].VERSION;
    }
}