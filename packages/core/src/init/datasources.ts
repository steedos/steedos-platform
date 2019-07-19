var objectql = require("@steedos/objectql");
var _ = require('underscore')

export class Datasources {
    static init() {
        var steedosSchema = objectql.getSteedosSchema();
        /* 初始化steedos-config中配置的数据源 */
        _.forEach(steedosSchema.getDataSources(), dataSource => {
            dataSource.init()
        })
    }
}