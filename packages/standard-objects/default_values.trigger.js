const _ = require('lodash');
const objectql = require('@steedos/objectql');

/**
  把原来的默认值公式表达式转换成新的表达式语法，原来的表达式语法如下所示：
  ==========
  取一个字段的值：使用“{”和“}” (注意都是半角)将字段名扩起来，如：{user.name}，注意不支持表单字段值，比如{price}
  基于当前用户的系统变量：包括姓名、角色、部门等
  ID: {userId}
  姓名：{user.name}
  所在部门（当申请人属于多个部门时，为所在主部门的全路径）： {user.organization.fullname}
  所在部门（最底层部门名）： {user.organization.name}
  角色名： {user.roles}
  手机： {user.mobile}
  固定电话： {user.work_phone}
  职务： {user.position}
  取当前工作区的信息
  ID: {spaceId}
  ===========
 * @param express 
 */
const getCompatibleDefaultValueExpression = (express) => {
    const regSingle = /^\{\w+(\.*\w+)*\}$/;//转换前端默认值语法{}包着的老语法，
    const regDouble = /^\{\{\w+(\.*\w+)*\}\}$/;//转换前端默认值语法{{}}包着的新语法
    // 需要注意的是公式引擎中$user指向的是当前用户的space_users记录而不是users记录。
    let result = express;
    if (regSingle.test(express)) {
        if (express.indexOf("userId") > -1) {
            result = "$user.user._id";
        }
        else if(express.indexOf("spaceId") > -1){
            result = "$user.space._id";
        }
        else if(express.indexOf("user.") > -1){
            result = express.replace("{user.", "$user.").replace("}", "");
        }
        else if(express.indexOf("now") > -1){
            result = "NOW()";
        }
        else {
            // 不支持的表达式直接跳过
            result = null;
        }
    }
    else if (regDouble.test(express)) {
        // 不支持转换前端默认值语法{{}}包着的新语法，因为里面是js表达式，可能性太多，无法转为公式引擎语法
    }
    return result;
}

const setDefaultValues = async function (doc, fields, userId, spaceId) {
    if (!userId) {
        return;
    }
    // console.log("==setDefaultValues=doc===", doc);
    let keys = _.keys(fields);
    // console.log("==setDefaultValues=keys===", keys);
    for (const key of keys) {
        if (!_.isNil(doc[key])) {
            continue;
        }
        const field = fields[key];
        let defaultValue = field.defaultValue;
        const fieldType = field.type;
        const valueType = typeof defaultValue;
        if (valueType === "boolean") {
            doc[field.name] = defaultValue;
        }
        else if (_.isArray(defaultValue)) {
            doc[field.name] = defaultValue;
        }
        else if (_.isNumber(defaultValue)) {
            if(!_.isNaN(defaultValue)){
                doc[field.name] = defaultValue;
            }
        }
        else if (valueType === "string") {
            if (defaultValue.length) {
                // 运行公式引擎
                defaultValue = getCompatibleDefaultValueExpression(defaultValue);
                // console.log("==setDefaultValues=defaultValue====", defaultValue);
                if(defaultValue){
                    doc[field.name] = await objectql.computeSimpleFormula(defaultValue, doc, userId, spaceId);
                    // console.log("==setDefaultValues=doc[field.name]====", field.name, doc[field.name]);
                }
            }
            else {
                doc[field.name] = "";
            }
        }
    }
}

module.exports = {
    listenTo: '*',
    when: ['before.insert'],
    handler: async function (ctx) {
        const params = ctx.params;
        // console.log("===params=1==", params);
        const { objectName, userId, spaceId } = params;
        const docs = params.new;
        if (!userId) {
            return;
        }
        const object = objectql.getObject(objectName);
        if (!object) {
            return;
        }
        const objectConfig = object.toConfig();
        // console.log("===fields=1==", objectConfig.fields);
        const fields = _.pickBy(objectConfig.fields, function (fieldItem) {
            return fieldItem.defaultValue;
        });
        // console.log("===fields=2==", fields);
        if (!_.isEmpty(fields)) {
            for (let doc of docs) {
                await setDefaultValues(doc, fields, userId, spaceId);
                // console.log("===before.insert=last==doc==", doc);
            }
        }
        // console.log("===before.insert=last==docs==", docs);
    }
}