// fix: Meteor code must always run within a Fiber.
const Fiber = require("fibers");
const _ = require('underscore');

const _validateObject = function (obj, objName) {
    var cObj = _.clone(obj);
    delete cObj._id; // 不校验_id
    var object = Creator.getObject(objName);
    if (object) {
        var schema = object.schema;
        if (schema) {
            var validationContext = schema.newContext();
            validationContext.validate(cObj);
            if (!validationContext.isValid()) {
                var err = validationContext.getErrorObject();
                console.error(err);
                throw new Error(`对象${objName}数据校验未通过：${err.message}`);
            }
        } else {
            throw new Error(`对象${objName}未定义SimpleSchema`);
        }
    } else {
        throw new Error('未能获取到对象：', objName);
    }
}


exports.loadObject = function (obj) {
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
    _validateObject(report, 'reports');
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