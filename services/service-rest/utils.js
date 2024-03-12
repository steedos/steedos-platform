/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2023-02-06 16:44:55
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2024-03-12 16:52:36
 * @Description: 
 */

const moment = require('moment');
const _ = require("underscore");
const { getSteedosSchema } = require('@steedos/objectql');

function formatFileSize(fileSize) {
    var rev, unit;
    rev = fileSize / 1024.00;
    unit = 'KB';
    if (rev > 1024.00) {
        rev = rev / 1024.00;
        unit = 'MB';
    }
    if (rev > 1024.00) {
        rev = rev / 1024.00;
        unit = 'GB';
    }
    return rev.toFixed(2) + unit;
};

function getFileStorageName(type) {
    switch (type) {
        case 'avatar':
            return 'avatars'
        case 'image':
            return 'images'
        case 'file':
            return 'files'
        default:
            break;
    }
};

function formatBasicFieldValue(valueType, field, value, objectConfig, userSession) {
    switch (valueType) {
        case 'text':
        case 'textarea':
        case 'html_text':
        case 'color':
        case 'autonumber':
        case 'url':
        case 'email':
        case 'html':
        case 'markdown':
        case 'code':
            return value || "";
        case 'boolean':
            return value ? "√" : ""
        case 'date':
            return value ? moment.utc(value).format("YYYY-MM-DD") : '';
        case 'datetime':
            return value ? moment(value).utcOffset(userSession.utcOffset || 8).format("YYYY-MM-DD HH:mm") : '';
        case 'time':
            return value ? moment.utc(value).format("HH:mm") : '';
        case 'number':
        case 'currency':
            return numberToString(value, field.scale, field.enable_thousands === false);
        case 'percent':
            const str = numberToString(value * 100, field.scale, field.enable_thousands === false);
            return str ? `${str}%` : ''
        case 'password':
            return _.isString(value) ? "******" : ""
        default:
            // console.log(field)
            console.error(
                `Graphql Display: need to handle new field type ${field.type} for ${objectConfig.name}.`
            );
            return value || "";
    }
}

function numberToString(number, scale, notThousands = false) {
    if (typeof number === "number") {
        number = number.toString();
    }
    if (!number) {
        return '';
    }
    if (number !== "NaN") {
        if (scale || scale === 0) {
            number = Number(number).toFixed(scale);
        }
        if (!notThousands) {
            if (!(scale || scale === 0)) {
                // 没定义scale时，根据小数点位置算出scale值
                let regDots = number.match(/\.(\d+)/);
                scale = regDots && regDots[1] && regDots[1].length
                if (!scale) {
                    scale = 0;
                }
            }
            let reg = /(\d)(?=(\d{3})+\.)/g;
            if (scale === 0) {
                reg = /(\d)(?=(\d{3})+\b)/g;
            }
            number = number.replace(reg, '$1,');
        }
        return number;
    } else {
        return "";
    }
}

async function callObjectServiceAction(actionName, userSession, data) {
    const broker = getSteedosSchema().broker;
    return broker.call(actionName, data, { meta: { user: userSession } })
}

// 获取object元数据
function getLocalService(objectApiName) {
    let steedosSchema = getSteedosSchema();
    return steedosSchema.broker.getLocalService(getObjectServiceName(objectApiName));
}

function correctName(name) {
    return name.replace(/\./g, "_").replace(/\$/g, "_");
}

function _getRelatedType(relatedFieldName, relatedObjName) {
    return `${relatedFieldName}(fields: [String], filters: JSON, top: Int, skip: Int, sort: String): [${relatedObjName}] `;
}

function getObjectServiceName(objectApiName){
    return `@${objectApiName}`;
}

function getGraphqlServiceName(){
    return 'graphql';
}


module.exports = {
    formatFileSize,
    getFileStorageName,
    formatBasicFieldValue,
    numberToString,
    callObjectServiceAction,
    getLocalService,
    correctName,
    _getRelatedType,
    getObjectServiceName,
    getGraphqlServiceName
}