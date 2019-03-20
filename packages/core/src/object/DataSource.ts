type DataSourceConfig = {
    name: String
    type: String
    connectionUri: String
}

export default class DataSource {
    config: DataSourceConfig;
    connected: boolean;
    
    constructor(config: DataSourceConfig){
        this.config = config;
    }

    static getDefaultDataSource() {
        return defaultDataSource
    }
}

let defaultDataSource = new DataSource( {
    name: "default", 
    type: "mongodb", 
    connectionUri: "mongodb://127.0.0.1/steedos"
});

