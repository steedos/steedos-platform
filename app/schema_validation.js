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
    _.each(fields, function (f, k) {
        _validateObject(_convertFunctionToString(f), objName, 'object_fields');
    })
}

var _validateObjectListViewss = function (list_views, objName) {
    _.each(list_views, function (v, k) {
        _validateObject(_convertFunctionToString(v), objName, 'object_listviews');
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

exports.validateObject = function (obj, objName) {
    if (objName === 'reports') {
        _validateObject(obj, 'reports', 'reports');
    } else {
        _validateObject(obj, objName, 'objects');
        if (obj.fields) {
            _validateObjectFields(obj.fields, objName);
        }
        if (obj.list_views) {
            _validateObjectListViewss(obj.list_views, objName);
        }
    }
}

exports.validateTrigger = function (trigger, objName) {
    _validateObject(trigger, objName, 'object_triggers');
}