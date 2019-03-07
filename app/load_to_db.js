// fix: Meteor code must always run within a Fiber.
var Fiber = require('fibers');
var _ = require('underscore');

var _validateObject = function (obj, objName, schemaName) {
    var cObj = _.clone(obj);
    delete cObj._id; // 不校验_id
    var schema = require(`../schemas/${schemaName}.js`);
    if (schema) {
        var validationContext = schema.newContext();
        validationContext.validate(cObj);
        if (!validationContext.isValid()) {
            console.log(`对象${objName}以下数据未通过校验：`)
            console.log(obj);
            var err = validationContext.validationErrors();
            throw new Error(`原因为：${JSON.stringify(err)}`);
        }
    } else {
        throw new Error(`对象${schemaName}未定义SimpleSchema`);
    }
}

var _validateObjectFields = function (fields, objName) {
    _.each(fields, function (f) {
        _validateObject(_convertFunctionToString(f), objName, 'object_fields');
    })
}

var _convertFunctionToString = function (obj) {
    var objStr = JSON.stringify(obj, function (key, val) {
        if (typeof val === 'function') {
            return val + '';
        }
        return val;
    })
    return JSON.parse(objStr);
}

exports.loadObject = function (obj) {
    _validateObject(obj, obj.name, 'objects');
    if (obj.fields) {
        _validateObjectFields(obj.fields, obj.name);
    }
    var collection = Creator.getCollection('objects');
    Fiber(function () {
        collection.upsert({
            name: obj.name
        }, {
            $set: obj
        });
    }).run();
}

exports.loadTrigger = function (trigger) {
    var collection = Creator.getCollection('objects');
    Fiber(function () {
        collection.upsert({
            name: trigger.name
        }, {
            $set: trigger
        });
    }).run();
}

exports.loadReports = function (report) {
    _validateObject(report, 'reports', 'reports');
    var collection = Creator.getCollection('reports');
    if (!report.space) {
        report.space = 'global';
    }
    Fiber(function () {
        collection.upsert({
            _id: report._id
        }, {
            $set: report
        });
    }).run();
}