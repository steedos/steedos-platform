import querystring = require('querystring');
import odataV4Mongodb = require('@steedos/odata-v4-mongodb');
import { formatFiltersToODataQuery } from "@steedos/filters";
import { requireAuthentication } from './';
// const Fiber = require('fibers');
declare var Fiber;
const moment = require('moment');
const json2xls = require('json2xls');
const objectql = require('@steedos/objectql')
const _ = require('lodash')
export const exportExcelExpress = require('@steedos/router').staticRouter();;
import { SteedosDatabaseDriverType } from '@steedos/objectql'

const MAX_EXPORT = 5000;

const exportRecordData = async function (req, res) {
    try {
        const userSession = req.user;
        let userId = userSession.userId;
        let urlParams = req.params;
        let queryParams = req.query;
        let filename = queryParams.filename;
        delete queryParams.filename;
        if (!filename) {
            filename = "导出"
        }
        
        if(queryParams.filters){
            queryParams.$filter = formatFiltersToODataQuery(JSON.parse(queryParams.filters), userSession);
        }

        
        const objectName = urlParams.objectName
        
        const collection = await objectql.getObject(objectName);
        if (!collection) {
            res.status(404).send({ msg: `collection not exists: ${objectName}` })
        }

        removeInvalidMethod(queryParams);
        let qs = decodeURIComponent(querystring.stringify(queryParams as querystring.ParsedUrlQueryInput));
        if (qs) {
            var createQuery = odataV4Mongodb.createQuery(qs);
        } else {
            var createQuery: any = {
                query: {},
                sort: undefined,
                projection: {},
                includes: []
            };
        }
        let permissions = await collection.getUserObjectPermission(userSession);
        if(permissions.allowExport != true){
            return res.status(403).send({ status: 403, error: 403, msg: `access failed` })
        }
        if (permissions.viewAllRecords || (permissions.viewCompanyRecords) || (permissions.allowRead && userId)) {

            let entities: any[] = [];
            let filters = queryParams.$filter as string || '';
            let fields = [];

            if (queryParams.$select) {
                fields = _.keys(createQuery.projection)
            }

            if (isPlatformDriver(collection.datasource.driver)) {
                filters = excludeDeleted(filters);
            }

            if (queryParams.$top !== '0') {
                let query = { filters: filters, fields: fields, top: Number(queryParams.$top) };
                if (queryParams.hasOwnProperty('$skip')) {
                    query['skip'] = Number(queryParams.$skip);
                }
                if (queryParams.$orderby) {
                    query['sort'] = queryParams.$orderby;
                }
                entities = await collection.find(query, userSession);
            }
            if(entities.length > MAX_EXPORT){
                return res.status(403).send({ status: 403, error: 403, msg: `超出允许的导出记录数(${MAX_EXPORT}条), 请调整搜索条件后重试.` })
            }
            if (entities) {

                const fieldConfigs = (await objectql.getSteedosSchema().broker.call(`objectql.getRecordView`, { objectName }, { meta: { user: userSession }})).fields

                for (let i=0; i<entities.length; i++) {
                    let record = entities[i]
                    delete record._id;
                    let parsedRecord = { };

                    let keys;
                    if(fields && fields.length >0){
                        keys = fields;
                    }else{
                        keys = _.keys(record);
                    }
                    for (let fieldName of keys) {
                        let fieldConfig = fieldConfigs[fieldName];
                        let fieldValue = record[fieldName]

                        if(!fieldConfig){
                           continue;
                        }
                        if (fieldValue || fieldValue == false) {
                            // record[fieldName] = await key2value(fieldValue, fieldConfig);
                            parsedRecord = Object.assign(parsedRecord, {[fieldConfig.label]: await key2value(fieldValue, fieldConfig, userSession)});
                        } else {
                            parsedRecord = Object.assign(parsedRecord, {[fieldConfig.label]: null});
                        }
                    }
                    
                    
                    entities[i] = parsedRecord;
                }
                if (_.isEmpty(entities)) {
                    //生成空表格
                    entities.push({ "": "" });
                }
                var xls = json2xls(entities);
                // fs.writeFileSync("test.xlsx", xls, 'binary');        
                res.writeHead(200, {
                    'Content-Type': 'application/octet-stream',
                    'Content-Disposition': 'attachment;filename=' + encodeURI(filename + '.xlsx'),
                    'Content-Length': xls.length,
                    'Access-Control-Expose-Headers': 'Content-Disposition'
                });
                res.end(xls, 'binary');

            } else {
                res.status(404).send({ code: 404, error: 404, message: "no record found" })
            }
        } else {
            res.status(403).send({ code: 403, error: 403, message: `access failed` })
        }
    } catch (error) {
        let _handleError = handleError(error);
        res.status(_handleError.statusCode).send(_handleError.body)
    }
};

const handleError = function (e: any) {
    console.log(e)
    let body = {};
    let error = {};
    error['message'] = e.message;
    let statusCode = 500;
    if (e.error && _.isNumber(e.error)) {
        statusCode = e.error;
    }
    error['code'] = statusCode;
    error['error'] = statusCode;
    error['details'] = e.details;
    error['reason'] = e.reason;
    body['error'] = error;
    return {
        statusCode: statusCode,
        body: body
    };
}

const removeInvalidMethod = function (queryParams: any) {
    if (queryParams.$filter && queryParams.$filter.indexOf('tolower(') > -1) {
        let removeMethod = function ($1: string) {
            return $1.replace('tolower(', '').replace(')', '')
        };
        queryParams.$filter = queryParams.$filter.replace(/tolower\(([^\)]+)\)/g, removeMethod);
    }
}

/**
 * 判断是否是mongo或meteor-mongo驱动
 * @param driverName 驱动名
 * @returns 
 */
 function isPlatformDriver(driverName: string): boolean {
    if (driverName == SteedosDatabaseDriverType.Mongo || driverName == SteedosDatabaseDriverType.MeteorMongo) {
        return true
    }
    return false
}

const excludeDeleted = function (filters: string) {
    if (filters && filters.indexOf('(is_deleted eq true)') > -1) {
        return filters
    }

    return filters ? `(${filters}) and (is_deleted ne true)` : `(is_deleted ne true)`;
}

const getOptionLabel = function (optionValue, options) {
    let option = _.find(options, function (o) {
        return o.value == optionValue
    });

    if(option && option.label){
        return option.label;
    }else{
        return optionValue;
    }
}

const key2value = async function (fieldValue, fieldConfig, userSession) {

    switch (fieldConfig.type) {
        case "boolean":
            if (fieldValue) {
                return TAPi18n.__("form_field_checkbox_yes", {}, userSession.language);
            } else {
                return TAPi18n.__("form_field_checkbox_no", {}, userSession.language);
            }
        case "select":
            let options = fieldConfig.options;

            if (fieldConfig.multiple && _.isArray(fieldValue)) {
                for (let i = 0; i < fieldValue.length; i++) {
                    let newValue = getOptionLabel(fieldValue[i], options);
                    fieldValue[i] = newValue
                }
                return fieldValue;
            } else {
                return getOptionLabel(fieldValue, options);;
            }
        case "master_detail":
        case "lookup":
            let reference_to = fieldConfig.reference_to
            let ref_coll: any;
            let id = fieldValue;
            // 判断reference_to是已经指定的对象名，还是通过function计算的对象名
            if (_.isFunction(reference_to) || (fieldConfig._reference_to && fieldConfig._reference_to.startsWith('function')) ) {
                reference_to = fieldValue.o;
                id = fieldConfig.multiple ? fieldValue.ids : fieldValue.ids[0];
            }
            ref_coll = await objectql.getObject(reference_to);
            const nameFieldKey = await ref_coll.getNameFieldKey();
            let reference_to_field = fieldConfig.reference_to_field
            let filters: any[] = []
            if (reference_to_field) {
                filters[0] = reference_to_field
            } else {
                filters[0] = '_id'
            }

            if (!fieldConfig.multiple) {
                filters[1] = "=";
                filters[2] = id;
                let ref_record = await ref_coll.find({ filters: filters, fields: [filters[0], nameFieldKey] });
                if(ref_record && ref_record.length == 1){
                    return ref_record[0][nameFieldKey];
                }else{
                    return id;
                }
            } else {
                filters[1] = "in";
                filters[2] = id;
                // 如果id不是数组，则返回id
                if (!_.isArray(id)) {
                    return id;
                }
                let ref_record = await ref_coll.find({ filters: filters, fields: [filters[0], nameFieldKey] });

                for (let i = 0; i < id.length; i++) {
                    let _record = _.find(ref_record, function(r){
                        return r[filters[0]] == id[i]
                    });
                    if(_record){
                        id[i] = _record[nameFieldKey]
                    }
                }
                return id;
            }
        case "date":
            return moment(fieldValue).format("YYYY-MM-DD");
        case "datetime":
            return moment(fieldValue).utcOffset(userSession.utcOffset).format("YYYY-MM-DD H:mm");
        case "time":
            return moment(fieldValue).utcOffset(0).format("HH:mm");
        case "summary":
            let summaryObj = await objectql.getObject(fieldConfig.summary_object);
            let summaryField = summaryObj.fields[fieldConfig.summary_field];
            if (summaryField) {
                return await key2value(fieldValue, summaryField, userSession);
            }
            return fieldValue;
        default:
            return fieldValue;
    }
}

exportExcelExpress.get('/api/record/export/:objectName', requireAuthentication, function (req, res) {
    return Fiber(function () {
        return exportRecordData(req, res);
    }).run();;
});