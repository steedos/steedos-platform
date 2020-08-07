var objectql = require("@steedos/objectql");
// var _ = require('underscore')

export class Datasources {
    // 初始化steedos-config中配置的数据源
    static loadFiles(){
        var steedosSchema = objectql.getSteedosSchema();
        for (let dataSource in steedosSchema.getDataSources()) {
            steedosSchema.getDataSource(dataSource).loadFiles();
        }
    }
    static async init() {
        var steedosSchema = objectql.getSteedosSchema();
        for (let dataSource in steedosSchema.getDataSources()) {
            await steedosSchema.getDataSource(dataSource).init();
        }
    }
}