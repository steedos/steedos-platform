/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2024-05-13 14:20:37
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2024-05-18 14:12:38
 * @FilePath: /steedos-platform-2.3/services/standard-object-database/main/default/triggers/object_functions.trigger.js
 * @Description: 
 */
const _ = require('lodash');
const objectql = require('@steedos/objectql');
const auth = require('@steedos/auth');
const validator = require('validator');
const PERMISSIONS = {
    allowEdit: false,
    allowDelete: false,
    allowRead: true,
};

const BASERECORD = {
    is_system: true,
    record_permissions: PERMISSIONS
};

const APINAMEM_MULTI_MSG = '函数Api Name不能重复';
const METADATA_CACHER_SERVICE_NAME = 'metadata-cachers-service'

const getSourceFunctions = async () => {
    const fDocs = await broker.call(`${METADATA_CACHER_SERVICE_NAME}.find`, { metadataName: 'object_functions' });
    const data = _.map(_.filter(fDocs, (item)=>{
        return !item._id || item._id == item.name
    }), (item) => {
        return {
            ...item,
            _id: item.name,
            ...BASERECORD
        };
    });
    return data;
}

function checkVariableName(variableName) {
    if (variableName.length > 50) {
        throw new Error("名称长度不能大于50个字符");
    }
    var reg = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;
    if (reg.test(variableName)) {
        var keywords = ['break', 'case', 'catch', 'continue', 'debugger', 'default', 'delete', 'do', 'else', 'finally', 'for', 'function', 'if', 'in', 'instanceof', 'new', 'return', 'switch', 'this', 'throw', 'try', 'typeof', 'var', 'void', 'while', 'with', 'true', 'false', 'null', 'undefined', 'NaN', 'Infinity'];
        if (keywords.indexOf(variableName) === -1) {
            return true;
        } else {
            throw new Error("名称不能包含关键字");
        }
    } else {
        throw new Error("名称只能包含字母、数字，必须以字母开头");
    }
}

module.exports = {
    beforeFind: async function () {
        delete this.query.fields;
    },
    afterFind: async function () {
        let spaceId = this.spaceId;
        let sourceData = await getSourceFunctions();
        this.data.values = this.data.values.concat(sourceData);
        this.data.values = objectql.getSteedosSchema().metadataDriver.find(this.data.values, this.query, spaceId);
    },
    afterCount: async function () {
        let spaceId = this.spaceId;
        this.data.values = this.data.values + objectql.getSteedosSchema().metadataDriver.count(await getSourceFunctions(), this.query, spaceId);
    },
    afterFindOne: async function () {
        let spaceId = this.spaceId;
        if (_.isEmpty(this.data.values)) {
            const records = objectql.getSteedosSchema().metadataDriver.find(await getSourceFunctions(), { filters: ['_id', '=', this.id] }, spaceId);
            if (records.length > 0) {
                this.data.values = records[0]
            }
        }
    },
    beforeInsert: async function () {
        if (validator.toBoolean(process.env.STEEDOS_TENANT_ENABLE_SAAS || 'false', true) == true) {
            throw new Error('No permission')
        }
        const doc = this.doc;
        checkVariableName(doc._name)
        const count = await objectql.getObject(this.object_name).count({ filters: [['_name', '=', doc._name], ['objectApiName', '=', doc.objectApiName]] })
        if (count > 0) {
            throw new Error(APINAMEM_MULTI_MSG)
        }
        doc.name = `${doc.objectApiName}_${doc._name}`
    },
    beforeUpdate: async function () {
        const doc = this.doc;
        if (doc._name) {
            checkVariableName(doc._name)
        }
        const count = await objectql.getObject(this.object_name).count({ filters: [['_name', '=', doc._name], ['objectApiName', '=', doc.objectApiName], ['_id', '!=', this.id]] })
        if (count > 0) {
            throw new Error(APINAMEM_MULTI_MSG)
        }
        doc.name = `${doc.objectApiName}_${doc._name}`
    }
}