const objectql = require('@steedos/objectql');
const _ = require('underscore');
const moment = require(`moment`);

const caculateAutonumber = async function (objectName, fieldName, rule, spaceId) {
    var padding = function (num, length) {
        var len = (num + "").length;
        var diff = length - len;
        if (diff > 0) {
            return Array(diff + 1).join("0") + num;
        }
        return num;
    };
    var anColl = objectql.getObject('autonumber');
    var date_from, date_to;
    var selector = {
        object_name: objectName,
        field_name: fieldName,
        space: spaceId
    };
    var m = moment();
    var yyyy = m.format('YYYY'),
        yy = m.format('YY'),
        mm = m.format('MM'),
        dd = m.format('DD');
    var hasYear = rule.indexOf('{YYYY}') > -1;
    var hasMonth = rule.indexOf('{MM}') > -1;
    var hasDay = rule.indexOf('{DD}') > -1;
    if (hasYear && hasMonth && hasDay) {
        date_from = m.startOf("day").toDate();
        date_to = m.endOf("day").toDate();
    } else if (hasYear && hasMonth) {
        date_from = m.startOf("month").toDate();
        date_to = m.endOf("month").toDate();
    } else if (hasYear) {
        date_from = m.startOf("year").toDate();
        date_to = m.endOf("year").toDate();
    }
    if (date_from && date_to) {
        selector.date_from = date_from;
        selector.date_to = date_to;
    } else {
        selector.date_from = null;
        selector.date_to = null;
    }

    const filters = [];

    for (const key in selector) {
        filters.push([key, '=', selector[key]]);
    }
    var anData = null;
    var records = await anColl.find({ filters });
    if (records && records.length > 0) {
        anData = records[0];
    }
    /**
     * autonunber增加编码规则字段（rule）存储 编号规则公式计算后的结果，作为联合查找autonumber记录的条件；
     * 根据时间段先查autonumber记录，如查到rule为空的记录则更新rule；如未查到则按照新的包含rule的查询条件查询或新增。
    */
    var anId;
    if (anData && !anData.rule) { // 查询到记录，但rule为空，则更新rule，目的是为了更新旧的自动编号记录
        anId = anData._id;
        await anColl.directUpdate(anId, {
            $inc: {
                current_no: 1
            },
            rule: rule
        });
    } else {
        // 按照新的包含rule的查询条件查询或新增
        let anDoc = null;
        filters.push(['rule', '=', encodeURIComponent(rule)]);
        let anDocs = await anColl.find({ filters });
        if (anDocs && anDocs.length > 0) {
            anDoc = anDocs[0];
        }
        if (anDoc) {
            // 更新
            anId = anDoc._id;
            await anColl.directUpdate(anId, {
                $inc: {
                    current_no: 1
                }
            });
        } else {
            anId = await anColl._makeNewID();
            var insertObj = {
                _id: anId,
                object_name: objectName,
                field_name: fieldName,
                space: spaceId,
                current_no: 1,
                rule: rule,
                current_no: 1 // defaultValue 规则调整为触发器实现，这里使用directInsert新增数据，故这里手动设置默认值为1
            };
            if (date_from && date_to) {
                insertObj.date_from = date_from;
                insertObj.date_to = date_to;
            }
            await anColl.directInsert(insertObj);
        }

    }
    var { current_no: currentNo } = await anColl.findOne(anId);
    var numberFormatMethod = function ($1) {
        return padding(currentNo, $1.length - 2);
    };
    var autonumber = rule.replace(/{YYYY}/g, yyyy).replace(/{YY}/g, yy).replace(/{MM}/g, mm).replace(/{DD}/g, dd).replace(/{[0]+}/g, numberFormatMethod);
    return autonumber;
};

const afterInsertAutoNumber = async function(){
    const { doc, object_name } = this;
    const spaceId = doc.space;
    if (!spaceId) {
        return;
    }
    var obj, fields, setObj = {};
    obj = objectql.getObject(object_name);
    fields = await obj.getFields();

    for (const k in fields) {
        const f = fields[k];
        let formula = f.formula;
        let rule = formula;
        if (f.type == 'autonumber' && formula) {
            // 拿到编号字段中配置的公式判断是否存在单引号/双引号，如果存在则当成公式计算；如没有则继续走编码规则计算
            if (formula.indexOf("'") > -1 || formula.indexOf('"') > -1) {
                const userId = null;
                // 先执行公式，返回编码规则
                rule = await objectql.computeFormula(formula, object_name, doc, userId, spaceId);
            }
            // 再执行编码规则
            setObj[k] = await caculateAutonumber(object_name, k, rule, spaceId);
        }
    }
    if (!_.isEmpty(setObj)) {
        await objectql.getObject(object_name).directUpdate(doc._id, setObj);
    }
}

module.exports = {
    listenTo: 'base',
    afterInsert: async function () {
        return await afterInsertAutoNumber.apply(this, arguments)
    }
}