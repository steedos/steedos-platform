var objectql = require("@steedos/objectql");
// var _ = require('underscore')

export class Datasources {

    static create() {
        objectql.getSteedosSchema();
    }

    // 初始化steedos-config中配置的数据源
    static async init() {
        var steedosSchema = objectql.getSteedosSchema();
        for (let dataSource in steedosSchema.getDataSources()) {
            await steedosSchema.getDataSource(dataSource).init();
        }
    }
}