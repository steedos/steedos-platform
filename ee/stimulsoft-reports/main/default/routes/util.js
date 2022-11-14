const objectql = require('@steedos/objectql');
const broker = objectql.getSteedosSchema().broker;
const _ = require('lodash');

/**
 * 
 * @param {*} query 查询设计器中的配置，query.options.parameters 获取参数默认值。
 * @param {*} report 报表记录。
 * @param {*} params 按钮中的执行脚本中带的参数。
 * @param {*} userId 
 * @param {*} spaceId 
 * @returns 
 */
const getQueryParameters = async (query, report, params, userSession) => {
    const parameters = {};
    const queryDefParameters = {};
    if (query && query.options && query.options.parameters) {
        _.each(query.options.parameters, (item) => {
            queryDefParameters[item.name] = _.isArray(item.value) ? item.value : item.value
        })
    }
    if (report.parameters && _.isArray(report.parameters)) {
        for (const parameter of report.parameters) {
            let value = params && _.has(params, parameter.name) ? params[parameter.name] : queryDefParameters[parameter.name];
            try {
                value = await objectql.computeSimpleFormula(parameter.value, params, userSession);
            } catch (error) {

            }
            parameters[parameter.name] = value;
        }
    }
    return parameters;
}

const getDatabase = async (reportId, userSession, params) => {
    const result = {
        serviceName: '',
        sampleConnectionString: '',
        data: {},
        types: {},
    }
    try {
        const record = await objectql.getObject('stimulsoft_reports').findOne(reportId);
        result.serviceName = record.label;
        result.sampleConnectionString = record.name;

        let queries = record.query;
        if (_.isString(record.query)) {
            queries = [record.query]
        }
        for (const queryId of queries) {
            const queryRecord = await broker.call('~packages-@steedos/service-charts.getQuery', { recordId: queryId });
            const parameters = await getQueryParameters(queryRecord, record, params || {}, userSession);
            const data = await broker.call('~packages-@steedos/service-charts.queries', { recordId: queryId, parameters, max_age: 10 });
            if (data && data.query_result && data.query_result.query) {
                const tableId = data.query_result.id || data.query_result._id;
                const dataSourceType = data.query_result.data_source_type || 'mongodb';
                try {
                    const tableColumns = {};
                    let objectFields = null;
                    if (dataSourceType === 'mongodb') {
                        const query = JSON.parse(data.query_result.query);
                        if (query.collection) {
                            tableColumns['_id'] = 'string';
                            const objectConfig = await objectql.getObject(query.collection).toConfig();
                            if (objectConfig) {
                                objectFields = objectConfig.fields;
                            }
                        }
                    }
                    _.each(data.query_result.data.columns, (item) => {
                        const name = item.name;
                        const type = item.type || 'string'
                        //TODO 如果字段在对象中，则自动根据对象中的字段类型，设置type
                        if (name.indexOf('.') < 0) {
                            const field = objectFields ? objectFields[name] : null;
                            if (field && field.multiple) {
                                // tableColumns[name] = 'Stimulsoft.System.StimulsoftStringList'
                                tableColumns[name] = 'string'
                            } else {
                                const ftype = field ? field.type : 'text';
                                switch (ftype) {
                                    case 'toggle':
                                    case 'boolean':
                                        tableColumns[name] = 'Stimulsoft.System.NullableBoolean'
                                        break;
                                    case 'number':
                                    case 'currency':
                                    case 'percent':
                                        tableColumns[name] = 'Stimulsoft.System.NullableLong'
                                        break;
                                    default:
                                        tableColumns[name] = type
                                        break;
                                }
                            }
                        }
                    })
                    result.types[tableId] = tableColumns;
                    _.each(data.query_result.data.rows, (row) => {
                        _.each(row, (v, k) => {
                            if (_.isArray(v)) {
                                row[k] = JSON.stringify(v)
                            }
                        })
                    })
                    result.data[tableId] = data.query_result.data.rows;
                } catch (error) {
                    console.log(error);
                }
            }
        }

    } catch (Exception) {
        console.log(Exception);

    }
    return result
}

exports.getDatabase = getDatabase;


exports.getReportWithData = async (reportId, userSession, parameters) => {
    const Stimulsoft = require('stimulsoft-reports-js');

    const record = await objectql.getObject('stimulsoft_reports').findOne(reportId);

    Stimulsoft.Base.StiFontCollection.addOpentypeFontFile("Roboto-Black.ttf");

    var report = new Stimulsoft.Report.StiReport();

    report.load(record.report_mrt);

    report.dictionary.databases.clear();

    const database = await getDatabase(reportId, userSession, parameters);

    var dataSet = new Stimulsoft.System.Data.DataSet(database.serviceName);

    dataSet.readJson(database.data);

    report.dictionary.dataSources.clear();

    _.each(database.types, (tableInfo, tableName) => {
        let dataSource = new Stimulsoft.Report.Dictionary.StiDataTableSource(
            database.serviceName,
            tableName
        );
        dataSource.sqlCommand = tableName;

        _.each(tableInfo, (columnType, columnName) => {
            dataSource.columns.add(
                new Stimulsoft.Report.Dictionary.StiDataColumn(
                    columnName,
                    columnName,
                    columnName,
                    columnType
                )
            );
        });
        report.dictionary.dataSources.add(dataSource);
    });

    report.regData(database.serviceName, database.serviceName, dataSet);

    return {
        report,
        data: database.data
    };
}