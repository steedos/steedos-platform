/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-05-26 16:56:54
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2025-03-04 10:59:05
 * @Description: 复制已有简档来创建新简档
 * 使用mongodb的事务处理，保证数据的一致性
 * 复制对象包括：简档、对象权限、字段权限、选项卡权限
 */
'use strict';
// @ts-check

const express = require("express");
const router = express.Router();
const auth = require('@steedos/auth');
const objectql = require('@steedos/objectql');
const InternalData = require('@steedos/standard-objects').internalData;
const _ = require('underscore');
const { MongoClient } = require('mongodb');

/**
 * body {
 *  originalPermissionSetId: "", // 已有简档的id
 *  name: "", // 新简档的名称
 *  label: "", // 新简档的标签
 * }
 */
router.post('/api/permission/permission_set/copy', auth.requireAuthentication, async function (req, res) {
    try {
        const userSession = req.user;
        const { userId, spaceId, company_id } = userSession;

        const { originalPermissionSetId, name, label } = req.body;
        if (!originalPermissionSetId) {
            throw new Error("originalPermissionSetId is required");
        }
        if (!name) {
            throw new Error("name is required");
        }
        if (!label) {
            throw new Error("label is required");
        }

        const psObj = objectql.getObject('permission_set');
        const poObj = objectql.getObject('permission_objects');
        const ptObj = objectql.getObject('permission_tabs');

        const originalPermissionSet = await psObj.findOne(originalPermissionSetId, {}, userSession);
        if (!originalPermissionSet) {
            throw new Error("permission_set not found");
        }
        // 校验简档是否是简档profile类型
        if (originalPermissionSet.type !== 'profile') {
            throw new Error("permission_set is not profile type");
        }

        const { name: originalPermissionSetName } = originalPermissionSet;

        // API名称不能重复
        const existPermissionSetCount = await psObj.count({
            filters: [
                ['name', '=', name],
                ['space', '=', spaceId],
            ]
        }, userSession);
        if (existPermissionSetCount > 0) {
            throw new Error("API名称不能重复");
        }

        // 事务 https://www.mongodb.com/docs/v4.4/core/transactions-in-applications/#core-api
        const client = new MongoClient(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        await client.connect();
        const db = client.db();

        // 检查collection是否存在，不存在则创建
        const objectNames = ['permission_objects', 'permission_fields', 'permission_tabs', 'permission_set'];
        const collectionInfos = await db.listCollections({}, { nameOnly: true }).toArray()
        const collectionsMap = _.indexBy(collectionInfos, 'name')
        for (const objectName of objectNames) {
            if (!collectionsMap[objectName]) {
                try {
                    await db.createCollection(objectName)
                } catch (error) {
                    console.error(error)
                    throw new Error(`create collection ${objectName} failed: ${error.message}`)
                }
            }
        }

        // Start a session.
        const session = client.startSession();

        const permissionObjectsColl = db.collection('permission_objects');
        const permissionFieldsColl = db.collection('permission_fields');
        const permissionTabsColl = db.collection('permission_tabs');
        const permissionSetColl = db.collection('permission_set');

        // Start a transaction
        session.startTransaction({ readConcern: { level: "majority" }, writeConcern: { w: "majority" }, readPreference: 'primary' });

        let newPermissionSet = null;

        // Operations inside the transaction
        try {
            // 基础信息
            const baseInfo = {
                created: new Date(),
                created_by: userId,
                modified: new Date(),
                modified_by: userId,
                space: spaceId,
                company_id: company_id,
                company_ids: [company_id],
                owner: userId,
            };

            // 创建新简档
            let newPermissionSetData = {
                ...originalPermissionSet,
                ...baseInfo,
                is_system: false,
                name,
                label,
                _id: await psObj._makeNewID(),
                copy_from: originalPermissionSetId,
            };

            delete newPermissionSetData.record_permissions;
            const insertPermissionSetResult = await permissionSetColl.insertOne(newPermissionSetData, { session });
            newPermissionSet = insertPermissionSetResult.ops[0];
            // console.log('newPermissionSet', newPermissionSet)

            // 创建对象权限和选项卡权限
            if (newPermissionSet) {
                const { _id: newPermissionSetId, name: newPermissionSetName } = newPermissionSet;
                // 对象权限数据来源于两个部分，1、内存 2、数据库
                const internalPermissionObjects = await getInternalPermissionObjects(originalPermissionSetId);
                const dbPermissionObjects = await poObj.directFind({ filters: [['space', '=', spaceId], ['permission_set_id', '=', originalPermissionSetId]] });
                const originalPermissionObjects = getCombinedPermissionObjects(internalPermissionObjects, dbPermissionObjects);
                const newPermissionObjects = []
                const newPermissionFields = []
                // 遍历原有的对象权限
                for (const poDoc of originalPermissionObjects) {
                    const fromId = poDoc._id;
                    const newId = await psObj._makeNewID();
                    // 由于 15.permission_objects.observe.object.js 中的 _change 函数中，调用了 permission_fields.resetFieldPermissions 方法，会阻塞redis查询，需要调整15.permission_objects.observe.object.js, 避免调用 resetFieldPermissions 方法
                    const newPermissionObject = {
                        ...poDoc,
                        ...baseInfo,
                        permission_set_id: newPermissionSetId,
                        name: `${poDoc.object_name}.${newPermissionSetName}`,
                        _id: newId,
                        copy_from: fromId
                    };
                    newPermissionObjects.push(newPermissionObject)
                    // 获取对象所有字段
                    const fields = await objectql.getObject('object_fields').find({ filters: [['object', '=', newPermissionObject.object_name]] });
                    for (const field of fields) {
                        const apiName = `${newPermissionSetName}.${newPermissionObject.object_name}.${field.name}`
                        const fieldPermission = await getFieldPermission(apiName)
                        newPermissionFields.push({
                            ...baseInfo,
                            name: apiName,
                            permission_set_id: newPermissionSetName,
                            permission_object: newPermissionObject.name,
                            object_name: newPermissionObject.object_name,
                            field: field.name,
                            editable: fieldPermission ? fieldPermission.editable : getFieldDefaultEditable(field),
                            readable: fieldPermission ? fieldPermission.readable : getFieldDefaultReadable(field),
                            _id: await psObj._makeNewID(),
                            copy_from: fieldPermission ? fieldPermission._id : `${originalPermissionSetName}.${newPermissionObject.object_name}.${field.name}`
                        })
                    }
                }

                const originalPermissionTabs = await ptObj.find({ filters: [['space', '=', spaceId], ['permission_set', '=', originalPermissionSet.name]] }, userSession);
                const newPermissionTabs = [];
                // 遍历原有的选项卡权限
                for (const ptDoc of originalPermissionTabs) {
                    const fromId = ptDoc._id;
                    const newId = await psObj._makeNewID();
                    delete ptDoc.record_permissions;
                    newPermissionTabs.push({
                        ...ptDoc,
                        ...baseInfo,
                        permission_set: newPermissionSetName,
                        _id: newId,
                        is_system: false,
                        copy_from: fromId
                    })
                }

                // 批量创建对象权限
                if (newPermissionTabs.length > 0) {
                    await permissionObjectsColl.insertMany(newPermissionObjects, { session });
                }

                // 批量创建字段权限
                if (newPermissionFields.length > 0) {
                    await permissionFieldsColl.insertMany(newPermissionFields, { session });
                }

                // 批量创建选项卡权限
                if (newPermissionTabs.length > 0) {
                    await permissionTabsColl.insertMany(newPermissionTabs, { session });
                }

                // 批量注册字段权限
                if (newPermissionFields.length > 0) {
                    const schema = objectql.getSteedosSchema();
                    const objectName = "permission_fields";
                    const SERVICE_NAME = `~database-${objectName}`;
                    await objectql.registerPermissionFields.mregister(schema.broker, SERVICE_NAME, newPermissionFields)
                }
            }

        } catch (error) {
            // Abort transaction on error
            await session.abortTransaction();
            throw error;
        }

        // Commit the transaction using write concern set at transaction start
        await session.commitTransaction();
        await session.endSession();
        await client.close();

        if (!newPermissionSet) {
            throw new Error("create permission_set failed");
        }

        res.status(200).send({
            status: 0,
            msg: "",
            data: {
                recordId: newPermissionSet._id
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            status: -1,
            msg: error.message
        });
    }

});
exports.default = router;

// 获取内存中的对象权限
async function getInternalPermissionObjects(permissionSetId) {
    // 查找permissionSetId对应的permissionSet
    const permissionSetDoc = (await objectql.getObject('permission_set').directFind({
        filters: [
            ['_id', '=', permissionSetId],
        ]
    }))[0];
    // 如果库中有记录则使用库中的name作为判断条件，否则使用permissionSetId
    const permissionSetName = permissionSetDoc ? permissionSetDoc.name : permissionSetId;

    let objectsPermissions = [];
    const datasources = objectql.getSteedosSchema().getDataSources();
    for (const datasourceName in datasources) {
        let datasource = datasources[datasourceName];
        let datasourceObjects = await datasource.getObjects();
        _.each(datasourceObjects, function (object) {
            const objectJSON = object.metadata;
            const objectName = objectJSON.name;
            if (!objectJSON._id && !_.include(InternalData.hiddenObjects, objectName)) {
                let permission_set = objectJSON.permission_set
                _.each(permission_set, function (v, code) {
                    if (code === permissionSetName) {
                        objectsPermissions.push(Object.assign({}, v, { _id: `${code}_${objectName}`, name: `${code}_${objectName}`, permission_set_id: code, object_name: objectName }))
                    }
                })
            }
        });
    }
    return objectsPermissions;
}
// 合并内存中的对象权限和数据库中的对象权限
// 如果dbPermissionObjects和internalPermissionObjects中permission_set_id存在相同的值，则以dbPermissionObjects中数据为准
function getCombinedPermissionObjects(internalPermissionObjects, dbPermissionObjects) {
    const dbPermissionObjectsIds = _.pluck(dbPermissionObjects, 'permission_set_id');
    const internalPermissionObjectsIds = _.pluck(internalPermissionObjects, 'permission_set_id');
    const sameIds = _.intersection(dbPermissionObjectsIds, internalPermissionObjectsIds);
    if (sameIds.length > 0) {
        for (const sameId of sameIds) {
            const dbPermissionObject = _.findWhere(dbPermissionObjects, { permission_set_id: sameId });
            const internalPermissionObject = _.findWhere(internalPermissionObjects, { permission_set_id: sameId });
            if (dbPermissionObject && internalPermissionObject) {
                const index = internalPermissionObjects.indexOf(internalPermissionObject);
                internalPermissionObjects.splice(index, 1, dbPermissionObject);
            }
        }
    }
    return [...internalPermissionObjects, ...dbPermissionObjects];
}

async function getFieldPermission(apiName) {
    const schema = objectql.getSteedosSchema();
    const config = await objectql.registerPermissionFields.get(schema.broker, apiName)
    return config ? config.metadata : null;
}

const systemFields = ['owner', 'created', 'created_by', 'modified', 'modified_by', 'locked', 'company_id', 'company_ids', 'instance_state'];

const getFieldDefaultEditable = (field) => {
    if (_.includes(systemFields, field.name) && (field.omit || field.hidden || field.readonly || field.disabled)) {
        return false;
    }
    if (field.omit || field.hidden || field.readonly || field.disabled) {
        return false;
    }
    return true;
}

const getFieldDefaultReadable = (field) => {
    if (_.includes(systemFields, field.name) && !field.hidden) {
        return true;
    }
    if (field.hidden) {
        return false
    }
    return true;
}