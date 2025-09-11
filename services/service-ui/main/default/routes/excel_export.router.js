"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const querystring = require("querystring");
const odataV4Mongodb = require("@steedos/odata-v4-mongodb");
const filters_1 = require("@steedos/filters");
const auth_1 = require("@steedos/auth");
const moment = require("moment");
const json2xls = require("json2xls");
const objectql = require("@steedos/objectql");
const _ = require("lodash");
const objectql_1 = require("@steedos/objectql");
const express = require("express");
const router = express.Router();
const MAX_EXPORT = 5000;
const exportRecordData = function (req, res) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            const userSession = req.user;
            let userId = userSession.userId;
            let urlParams = req.params;
            let queryParams = req.query;
            let filename = queryParams.filename;
            delete queryParams.filename;
            if (!filename) {
                filename = "导出";
            }
            if (queryParams.filters) {
                queryParams.$filter = (0, filters_1.formatFiltersToODataQuery)(JSON.parse(queryParams.filters), userSession);
            }
            const objectName = urlParams.objectName;
            const collection = yield objectql.getObject(objectName);
            if (!collection) {
                res.status(404).send({ msg: `collection not exists: ${objectName}` });
            }
            removeInvalidMethod(queryParams);
            let qs = decodeURIComponent(querystring.stringify(queryParams));
            if (qs) {
                var createQuery = odataV4Mongodb.createQuery(qs);
            }
            else {
                var createQuery = {
                    query: {},
                    sort: undefined,
                    projection: {},
                    includes: [],
                };
            }
            let permissions = yield collection.getUserObjectPermission(userSession);
            if (permissions.allowExport != true) {
                return res
                    .status(403)
                    .send({ status: 403, error: 403, msg: `access failed` });
            }
            if (permissions.viewAllRecords ||
                permissions.viewCompanyRecords ||
                (permissions.allowRead && userId)) {
                let entities = [];
                let filters = queryParams.$filter || "";
                let fields = [];
                if (queryParams.$select) {
                    fields = _.keys(createQuery.projection);
                }
                if (isPlatformDriver(collection.datasource.driver)) {
                    filters = excludeDeleted(filters);
                }
                if (queryParams.$top !== "0") {
                    let query = {
                        filters: filters,
                        fields: fields,
                        top: Number(queryParams.$top),
                    };
                    if (Object.prototype.hasOwnProperty.call(queryParams, "$skip")) {
                        query["skip"] = Number(queryParams.$skip);
                    }
                    if (queryParams.$orderby) {
                        query["sort"] = queryParams.$orderby;
                    }
                    entities = yield collection.find(query, userSession);
                }
                if (entities.length > MAX_EXPORT) {
                    return res
                        .status(403)
                        .send({
                        status: 403,
                        error: 403,
                        msg: `超出允许的导出记录数(${MAX_EXPORT}条), 请调整搜索条件后重试.`,
                    });
                }
                if (entities) {
                    const fieldConfigs = (yield objectql
                        .getSteedosSchema()
                        .broker.call(`objectql.getRecordView`, { objectName }, { meta: { user: userSession } })).fields;
                    for (let i = 0; i < entities.length; i++) {
                        let record = entities[i];
                        delete record._id;
                        let parsedRecord = {};
                        let keys;
                        if (fields && fields.length > 0) {
                            keys = fields;
                        }
                        else {
                            keys = _.keys(record);
                        }
                        for (let fieldName of keys) {
                            let fieldConfig = fieldConfigs[fieldName];
                            let fieldValue = record[fieldName];
                            if (!fieldConfig) {
                                continue;
                            }
                            if (fieldValue || fieldValue == false) {
                                parsedRecord = Object.assign(parsedRecord, {
                                    [fieldConfig.label]: yield key2value(fieldValue, fieldConfig, userSession),
                                });
                            }
                            else {
                                parsedRecord = Object.assign(parsedRecord, {
                                    [fieldConfig.label]: null,
                                });
                            }
                        }
                        entities[i] = parsedRecord;
                    }
                    if (_.isEmpty(entities)) {
                        entities.push({ "": "" });
                    }
                    var xls = json2xls(entities);
                    res.writeHead(200, {
                        "Content-Type": "application/octet-stream",
                        "Content-Disposition": "attachment;filename=" + encodeURI(filename + ".xlsx"),
                        "Content-Length": xls.length,
                        "Access-Control-Expose-Headers": "Content-Disposition",
                    });
                    res.end(xls, "binary");
                }
                else {
                    res
                        .status(404)
                        .send({ code: 404, error: 404, message: "no record found" });
                }
            }
            else {
                res.status(403).send({ code: 403, error: 403, message: `access failed` });
            }
        }
        catch (error) {
            let _handleError = handleError(error);
            res.status(_handleError.statusCode).send(_handleError.body);
        }
    });
};
const handleError = function (e) {
    console.log(e);
    let body = {};
    let error = {};
    error["message"] = e.message;
    let statusCode = 500;
    if (e.error && _.isNumber(e.error)) {
        statusCode = e.error;
    }
    error["code"] = statusCode;
    error["error"] = statusCode;
    error["details"] = e.details;
    error["reason"] = e.reason;
    body["error"] = error;
    return {
        statusCode: statusCode,
        body: body,
    };
};
const removeInvalidMethod = function (queryParams) {
    if (queryParams.$filter && queryParams.$filter.indexOf("tolower(") > -1) {
        let removeMethod = function ($1) {
            return $1.replace("tolower(", "").replace(")", "");
        };
        queryParams.$filter = queryParams.$filter.replace(/tolower\(([^\)]+)\)/g, removeMethod);
    }
};
function isPlatformDriver(driverName) {
    if (driverName == objectql_1.SteedosDatabaseDriverType.Mongo ||
        driverName == objectql_1.SteedosDatabaseDriverType.MeteorMongo) {
        return true;
    }
    return false;
}
const excludeDeleted = function (filters) {
    if (filters && filters.indexOf("(is_deleted eq true)") > -1) {
        return filters;
    }
    return filters
        ? `(${filters}) and (is_deleted ne true)`
        : `(is_deleted ne true)`;
};
const getOptionLabel = function (optionValue, options) {
    let option = _.find(options, function (o) {
        return o.value == optionValue;
    });
    if (option && option.label) {
        return option.label;
    }
    else {
        return optionValue;
    }
};
const key2value = function (fieldValue, fieldConfig, userSession) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        var _a;
        switch (fieldConfig.type) {
            case "boolean":
                if (fieldValue) {
                    return t("form_field_checkbox_yes", {}, userSession.language);
                }
                else {
                    return t("form_field_checkbox_no", {}, userSession.language);
                }
            case "select":
                let options = fieldConfig.options;
                if (fieldConfig.multiple && _.isArray(fieldValue)) {
                    for (let i = 0; i < fieldValue.length; i++) {
                        let newValue = getOptionLabel(fieldValue[i], options);
                        fieldValue[i] = newValue;
                    }
                    return fieldValue;
                }
                else {
                    return getOptionLabel(fieldValue, options);
                }
            case "master_detail":
            case "lookup":
                let reference_to = fieldConfig.reference_to;
                let ref_coll;
                let id = fieldValue;
                if (_.isFunction(reference_to) ||
                    (fieldConfig._reference_to &&
                        fieldConfig._reference_to.startsWith("function"))) {
                    reference_to = fieldValue.o;
                    id = fieldConfig.multiple ? fieldValue.ids : fieldValue.ids[0];
                }
                ref_coll = yield objectql.getObject(reference_to);
                const nameFieldKey = yield ref_coll.getNameFieldKey();
                let reference_to_field = fieldConfig.reference_to_field;
                let filters = [];
                if (reference_to_field) {
                    filters[0] = reference_to_field;
                }
                else {
                    filters[0] = "_id";
                }
                if (!fieldConfig.multiple) {
                    filters[1] = "=";
                    filters[2] = id;
                    let ref_record = yield ref_coll.find({
                        filters: filters,
                        fields: [filters[0], nameFieldKey],
                    });
                    if (ref_record && ref_record.length == 1) {
                        return ref_record[0][nameFieldKey];
                    }
                    else {
                        return id;
                    }
                }
                else {
                    filters[1] = "in";
                    filters[2] = id;
                    if (!_.isArray(id)) {
                        return id;
                    }
                    let ref_record = yield ref_coll.find({
                        filters: filters,
                        fields: [filters[0], nameFieldKey],
                    });
                    for (let i = 0; i < id.length; i++) {
                        let _record = _.find(ref_record, function (r) {
                            return r[filters[0]] == id[i];
                        });
                        if (_record) {
                            id[i] = _record[nameFieldKey];
                        }
                    }
                    return id;
                }
            case "date":
                return moment(fieldValue).format("YYYY-MM-DD");
            case "datetime":
                return moment(fieldValue)
                    .utcOffset((_a = userSession.utcOffset) !== null && _a !== void 0 ? _a : 8)
                    .format("YYYY-MM-DD H:mm");
            case "time":
                return moment(fieldValue).utcOffset(0).format("HH:mm");
            case "summary":
                let summaryObj = yield objectql.getObject(fieldConfig.summary_object);
                let summaryField = summaryObj.fields[fieldConfig.summary_field];
                if (summaryField) {
                    return yield key2value(fieldValue, summaryField, userSession);
                }
                return fieldValue;
            default:
                return fieldValue;
        }
    });
};
router.get("/api/record/export/:objectName", auth_1.requireAuthentication, function (req, res) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return yield exportRecordData(req, res);
    });
});
exports.default = router;
