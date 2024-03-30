/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2024-03-23 14:58:33
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2024-03-30 17:30:17
 */
import * as _ from 'lodash';
import { Dictionary, JsonMap } from "@salesforce/ts-types";
import { SteedosUserSession } from ".";
import { evaluate } from "amis-formula";

/**
  把原来的默认值公式表达式转换成新的表达式语法，原来的表达式语法如下所示：
  ==========
  - 取一个字段的值：使用“{”和“}” (注意都是半角)将字段名扩起来，如：{user.name}，注意不支持表单字段值，比如{price}
  - 基于当前用户的系统变量：包括姓名、角色、部门等
  ID: {userId}
  姓名：{user.name}
  所在部门（当申请人属于多个部门时，为所在主部门的全路径）： {user.organization.fullname}
  所在部门（最底层部门名）： {user.organization.name}
  角色名： {user.roles} 不支持，user.roles写法是userSession的，公式引擎中user指向的space_users而不是userSession
  手机： {user.mobile}
  固定电话： {user.work_phone}
  职务： {user.position}
  - 取当前工作区的信息
  ID: {spaceId}
  - 取当前时间
  {now}
  - 双层大括号语法，只兼容基本语法，复杂的直接忽略默认值
  {{global.userId}}
  {{global.spaceId}}
  {{global.user.xxx}}
  {{global.now}}
  ===========
 * @param express 
 */
const getCompatibleDefaultValueExpression = (express: string) => {
    const regSingle = /^\{\w+(\.*\w+)*\}$/;//转换前端默认值语法{}包着的老语法，
    const regDouble = /^\{\{\w+(\.*\w+)*\}\}$/;//转换前端默认值语法{{}}包着的新语法
    // 需要注意的是公式引擎中$user指向的是当前用户的space_users记录而不是users记录。
    let result = express;
    if (regSingle.test(express)) {
        if (express.indexOf("userId") > -1) {
            //sf公式为"$user.user._id";
            result = "${global.userId}";
        }
        else if (express.indexOf("spaceId") > -1) {
            //sf公式为"$user.space._id";
            result = "${global.spaceId}";
        }
        else if (express.indexOf("user.") > -1) {
            //sf公式为:express.replace("{user.", "$user.").replace("}", "");
            result = express.replace("{user.", "${global.user.");
        }
        else if (express.indexOf("now") > -1) {
            //sf公式为:NOW()
            result = "${NOW()}";
        }
        else {
            // 不支持的表达式直接跳过
            result = null;
        }
    }
    else if (regDouble.test(express)) {
        // 只支持有限的转换前端默认值语法{{}}包着的新语法，因为里面是js表达式，可能性太多，无法都支持转为公式引擎语法
        // 只支持兼容以下最基本的格式
        /*
        {{global.userId}}
        {{global.spaceId}}
        {{global.user.xxx}}
        {{global.now}}
        */
        if (express.indexOf("global.userId") > -1) {
            //sf公式为"$user.user._id";
            result = "${global.userId}";
        }
        else if (express.indexOf("global.spaceId") > -1) {
            //sf公式为"$user.space._id";
            result = "${global.spaceId}";
        }
        else if (express.indexOf("global.user.") > -1) {
            //sf公式为:express.replace("{{global.user.", "$user.").replace("}}", "");
            result = express.replace("{{global.user.", "${global.user.").replace("}}", "}");
        }
        else if (express.indexOf("global.now") > -1) {
            //sf公式为:NOW()
            result = "${NOW()}";
        }
        else {
            // 不支持的表达式直接跳过
            result = null;
        }
    }

    if(result){
        // 双引号静态默认值，删掉前后的双引号，兼容之前默认值按sf公式执行时，静态默认值要求双引号包裹的历史代码。
        // 注意这里是全字匹配，"abc"会转为abc，但是"abc"123不会转为abc123，只会保持原样
        const regDoubleQuote = /^\"(.+)\"$/;
        if(regDoubleQuote.test(result)){
            result = result.replace(regDoubleQuote, "$1");
        }
    }

    return result;
}

const isAmisFormula = (express: string) => {
    // 有${}包裹的表达式就识别为amis公式
    return /\$\{.+\}/.test(express);
}

const getAmisGlobalVariables = (userSession?: SteedosUserSession) => {
    if (!userSession) {
        return {};
    }
    return {
        "global": {
            "userId": userSession.userId,
            "spaceId": userSession.spaceId,
            "user": userSession
        }
    }
}

const getDefaultValues = function (doc: Dictionary<any>, fields: any, userSession?: SteedosUserSession) {
    let keys = _.keys(fields);
    for (const key of keys) {
        if (/\./.test(key)) {
            // 不支持也不需要给grid/object字段加默认值
            continue;
        }
        if (!_.isNil(doc[key]) || doc[key] === null) {
            // doc中字段已有值的话 || 默认值被手动清空 不加默认值 
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
            if (!_.isNaN(defaultValue)) {
                doc[field.name] = defaultValue;
            }
        }
        else if (valueType === "string") {
            if (defaultValue.length) {
                // 运行公式引擎
                defaultValue = getCompatibleDefaultValueExpression(defaultValue);
                if (defaultValue) {
                    if (isAmisFormula(defaultValue)) {
                        try {
                            const globalVariables = getAmisGlobalVariables(userSession);
                            // 这里执行amis公式特意不传入doc，因为按设计是不支持默认值中引用当前记录中字段值
                            const amisFormulaValue = evaluate(defaultValue, globalVariables, { evalMode: field.evalMode });
                            if (defaultValue === amisFormulaValue) {
                                throw new Error(`Amis formula "${defaultValue}" evaluate failed "Function is not defined".`);
                            } else {
                                doc[field.name] = amisFormulaValue;
                            }
                        } catch (e) {
                            throw new Error(`Catch an error "${e.message}" while evaluate amis formula "${defaultValue}".`);
                        }
                    }
                    else {
                        // 不是amis公式就按静态默认值直接返回，不再执行sf公式
                        // defaultValue = await objectql.computeSimpleFormula(defaultValue, doc, userSession);
                        // if (field.multiple && !_.isArray(defaultValue)) {
                        //     defaultValue = defaultValue.split(',');
                        // }
                        doc[field.name] = defaultValue;
                    }
                }
            }
            else {
                doc[field.name] = "";
            }
        }
    }
    return doc;
}

export function getDefaultValuesDoc(object: any, doc: Dictionary<any>, userSession?: SteedosUserSession) {
    const { userId } = userSession || {};

    if (!userId) {
        return doc;
    }

    const fields = _.pickBy(object.fields, function (fieldItem) {
        return fieldItem.defaultValue;
    });
    if (!_.isEmpty(fields)) {
        return getDefaultValues(doc, fields, userSession);
    }
    return doc;
}
