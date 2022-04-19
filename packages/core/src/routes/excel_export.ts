import querystring = require('querystring');
import odataV4Mongodb = require('odata-v4-mongodb');
import steedosI18n = require("@steedos/i18n");
import { requireAuthentication } from './';
const express = require("express");
const Fiber = require('fibers');
const moment = require('moment');
const json2xls = require('json2xls');
const objectql = require('@steedos/objectql')
const _ = require('lodash')
export const exportExcelExpress = express.Router();

const exportRecordData = async function (req, res) {
    try {
        const userSession = req.user;
        let userId = userSession.userId;
        let urlParams = req.params;
        let queryParams = req.query;
        let filename = queryParams.filename;
        if (!filename) {
            filename = "导出"
        }
        let spaceId = userSession.spaceId;
        
        const objectName = urlParams.objectName
        let key = urlParams.objectName;
        
        const collection = await objectql.getObject(objectName);
        if (!collection) {
            res.status(404).send({ msg: `collection not exists: ${objectName}` })
        }
        
        let lng = userSession.language;
        if(lng){
            steedosI18n.translationObject(lng, collection.name, collection)
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
        if (permissions.viewAllRecords || (permissions.viewCompanyRecords) || (permissions.allowRead && userId)) {

            let entities: any[] = [];
            let filters = queryParams.$filter as string || '';
            let fields = [];

            if (queryParams.$select) {
                fields = _.keys(createQuery.projection)
            }

            filters = excludeDeleted(filters);

            if (queryParams.$top !== '0') {
                let query = { filters: filters, fields: fields, top: Number(queryParams.$top) };
                if (queryParams.hasOwnProperty('$skip')) {
                    query['skip'] = Number(queryParams.$skip);
                }
                if (queryParams.$orderby) {
                    query['sort'] = queryParams.$orderby;
                }
                let externalPipeline = makeAggregateLookup(createQuery, key, spaceId, userSession);
                entities = await collection.aggregate(query, externalPipeline, userSession);
            }
            if (entities) {

                const fieldConfigs = collection.fields

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
                    'Content-Length': xls.length
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

const makeAggregateLookup = function (createQuery: any, key: string, spaceId: string, userSession: object) {

    if (_.isEmpty(createQuery.includes)) {
        return [];
    }
    let obj = objectql.getObject(key);
    let pipeline: any = [];

    for (let i = 0; i < createQuery.includes.length; i++) {
        let navigationProperty = createQuery.includes[i].navigationProperty;
        navigationProperty = navigationProperty.replace('/', '.')
        let field = obj.fields[navigationProperty].toConfig();
        if (field && (field.type === 'lookup' || field.type === 'master_detail')) {
            let foreignFieldName = field.reference_to_field || '_id';

            if (_.isFunction(field.reference_to)) {
                field.reference_to = field.reference_to();
            }
            if (_.isString(field.reference_to)) {
                let refFieldName = field.name;
                let lookup = {
                    from: field.reference_to,
                    localField: refFieldName,
                    foreignField: foreignFieldName,
                    as: `${refFieldName}_$lookup`
                };

                pipeline.push({ $lookup: lookup });

            } else if (_.isArray(field.reference_to)) {
                _.each(field.reference_to, function (relatedObjName) {
                    let refFieldName = field.name;
                    let lookup = {
                        from: relatedObjName,
                        localField: refFieldName + '.ids',
                        foreignField: foreignFieldName,
                        as: `${refFieldName}` + '_$lookup' + `_${relatedObjName}`
                    };

                    pipeline.push({ $lookup: lookup });
                })

            }
        }
    };

    return pipeline;
}
const removeInvalidMethod = function (queryParams: any) {
    if (queryParams.$filter && queryParams.$filter.indexOf('tolower(') > -1) {
        let removeMethod = function ($1: string) {
            return $1.replace('tolower(', '').replace(')', '')
        };
        queryParams.$filter = queryParams.$filter.replace(/tolower\(([^\)]+)\)/g, removeMethod);
    }
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
                return '真';
            } else {
                return '假';
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
            let ref_coll = await objectql.getObject(reference_to);
            let reference_to_field = fieldConfig.reference_to_field
            let filters: any[] = []
            if (reference_to_field) {
                filters[0] = reference_to_field
            } else {
                filters[0] = '_id'
            }

            if (!fieldConfig.multiple) {
                filters[1] = "=";
                filters[2] = fieldValue;
                let ref_record = await ref_coll.find({ filters: filters });
                if(ref_record && ref_record.length == 1){
                    return ref_record[0].name;
                }else{
                    return fieldValue;
                }
            } else {
                filters[1] = "in";
                filters[2] = fieldValue;
                // 如果fieldValue不是数组，则返回fieldValue
                if (!_.isArray(fieldValue)) {
                    return fieldValue;
                }
                let ref_record = await ref_coll.find({ filters: filters, fields: [filters[0], "name"] });

                for (let i = 0; i < fieldValue.length; i++) {
                    let _record = _.find(ref_record, function(r){
                        return r[filters[0]] == fieldValue[i]
                    });
                    if(_record){
                        fieldValue[i] = _record.name
                    }
                }
                return fieldValue;
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