/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-03-28 09:35:34
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-07-05 15:13:22
 * @Description: 
 */
import { SteedosFieldDBType } from "./index";
import { ConnectionOptions, EntitySchema } from "typeorm";
import { SteedosDriverConfig } from "./driver";
import { SteedosTypeormDriver } from "../typeorm";
import { Dictionary } from "@salesforce/ts-types";
import { SteedosObjectType } from "../types";
import { SQLLang } from '@steedos/odata-v4-sql';
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
        let connectString = this.config.connectString;
        if (!connectString){
            connectString = `${this.config.host}:${this.config.port}/${this.config.database}`;
        }
        return  {
            type: "oracle",
            url: this._url,
            name: (new Date()).getTime().toString(),
            entities: Object.values(this._entities),
            host: this.config.host,
            port: this.config.port,
            username: this.config.username,
            password: this.config.password,
            database: this.config.database,
            connectString: connectString,
            logging: this.config.logging
        };
    }

    getEntities(objects: Dictionary<SteedosObjectType>): Dictionary<EntitySchema> {
        return getEntities(objects, "oracle");
    }

    async getDatabaseVersion() {
        let result = await this.run(`select version from sys.product_component_version where product like '%Oracle%'`);
        return result.length && result[0] && result[0].VERSION;
    }
}