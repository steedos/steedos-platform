import { SteedosColumnType } from "./index";
import { createConnection, ConnectionOptions } from "typeorm";
import { SteedosDriverConfig } from "./driver";
import { SteedosTypeormDriver } from "../typeorm";

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
            host: this._url,
            name: (new Date()).getTime().toString(),
            entities: Object.values(this._entities),
            username: this.config.username,
            password: this.config.password,
            database: this.config.database
            // username: "sa",
            // password: "hotoainc.",
            // database: "test"

            // type: "mssql",
            // host: "localhost",
            // port: 3306,
            // username: "test",
            // password: "test",
            // database: "test"
        };
    }

    async connect() {
        console.log("=======connect====2=");
        if (!this._entities) {
            throw new Error("Entities must be registered before connect");
        }
        if (!this._client) {
            let options = this.getConnectionOptions()
            console.log("connecting sql server ... ", options);
            this._client = await createConnection(options);
            return true;
        }
    }
}