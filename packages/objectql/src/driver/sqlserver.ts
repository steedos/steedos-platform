/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-03-28 09:35:34
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-07-05 15:13:45
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

export class SteedosSqlServerDriver extends SteedosTypeormDriver {
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

    sqlLang: SQLLang = SQLLang.MsSql;

    constructor(config: SteedosDriverConfig) {
        super(config);
    }

    getConnectionOptions(): ConnectionOptions {
        if(this.config.options){
            this.config.options.encrypt = false;
        }
        else{
            this.config.options={
                encrypt: false,
            }
        }
        return  {
            type: "mssql",
            url: this._url,
            name: (new Date()).getTime().toString(),
            entities: Object.values(this._entities),
            host: this.config.host,
            port: this.config.port,
            username: this.config.username,
            password: this.config.password,
            database: this.config.database,
            options: this.config.options,
            logging: this.config.logging
        };
    }

    getEntities(objects: Dictionary<SteedosObjectType>): Dictionary<EntitySchema> {
        return getEntities(objects, "mssql");
    }

    async getDatabaseVersion() {
        let result = await this.run(`SELECT SERVERPROPERTY('ProductVersion') AS VERSION`);
        return result.length && result[0] && result[0].VERSION;
    }
}
