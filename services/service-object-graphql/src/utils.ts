/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2023-02-06 16:44:55
 * @LastEditors: liaodaxue
 * @LastEditTime: 2023-12-14 15:05:58
 * @Description: 
 */

import moment = require('moment');
import _ = require("underscore");
import { getSteedosSchema } from '@steedos/objectql';

export function formatFileSize(fileSize) {
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

export function getFileStorageName(type) {
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

export function formatBasicFieldValue(valueType, field, value, objectConfig, userSession) {
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
            return numberToString(value, field.scale, field.disable_thousands);
        case 'percent':
            const str = numberToString(value * 100, field.scale, field.disable_thousands);
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

export function numberToString(number: number | string, scale: number, notThousands: boolean = false) {
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

export async function callObjectServiceAction(actionName, userSession, data?) {
    const broker = getSteedosSchema().broker;
    return broker.call(actionName, data, { meta: { user: userSession } })
}

// 获取object元数据
export function getLocalService(objectApiName: string) {
    let steedosSchema = getSteedosSchema();
    return steedosSchema.broker.getLocalService(getObjectServiceName(objectApiName));
}

export function correctName(name: string) {
    return name.replace(/\./g, "_").replace(/\$/g, "_");
}

export function _getRelatedType(relatedFieldName, relatedObjName) {
    return `${relatedFieldName}(fields: [String], filters: JSON, top: Int, skip: Int, sort: String): [${relatedObjName}] `;
}

export function getObjectServiceName(objectApiName: string){
    return `@${objectApiName}`;
}

export function getGraphqlServiceName(){
    return 'graphql';
}