/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-05-26 16:56:54
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-05-26 19:28:09
 * @Description: 复制已有简档来创建新简档
 */
'use strict';
// @ts-check

const express = require("express");
const router =require('@steedos/router').staticRouter()
const core = require('@steedos/core');
const objectql = require('@steedos/objectql');

/**
 * body {
 *  originalPermissionSetId: "", // 已有简档的id
 *  name: "", // 新简档的名称
 *  label: "", // 新简档的标签
 * }
 */
router.post('/api/permission/permission_set/copy', core.requireAuthentication, async function (req, res) {
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
        const pfObj = objectql.getObject('permission_fields');

        const originalPermissionSet = await psObj.findOne(originalPermissionSetId, {}, userSession);
        if (!originalPermissionSet) {
            throw new Error("permission_set not found");
        }
        // 校验简档是否是简档profile类型
        if (originalPermissionSet.type !== 'profile') {
            throw new Error("permission_set is not profile type");
        }

        // 基础信息
        const baseInfo = {
            created: new Date(),
            created_by: userId,
            modified: new Date(),
            modified_by: userId,
            space: spaceId,
            company_id: company_id
        };

        // 创建新简档
        delete originalPermissionSet._id;
        const newPermissionSet = await psObj.insert({
            ...originalPermissionSet,
            ...baseInfo,
            name,
            label
        });

        // 创建对象权限
        if (newPermissionSet) {
            const orininalPermissionSetName = originalPermissionSet.name;
            const { _id: newPermissionSetId, name: newPermissionSetName } = newPermissionSet;
            const originalPermissionObjects = await poObj.find({ filters: [['space', '=', spaceId], ['permission_set_id', '=', originalPermissionSetId]] }, userSession);
            // 遍历原有的对象权限
            for (const poDoc of originalPermissionObjects) {
                // 创建新的对象权限
                delete poDoc._id;
                const newPermissionObject = await poObj.insert({
                    ...poDoc,
                    ...baseInfo,
                    permission_set_id: newPermissionSetId,
                });
                // 创建新的字段权限
                // 由于 15.permission_objects.observe.object.js 中的 _change 函数中，调用了 permission_fields.resetFieldPermissions 方法，会自动创建新的字段权限，为防止重复创建故这里不手动创建
                // if (newPermissionObject) {
                //     const newPermissionObjectName = newPermissionObject.name;
                //     const originalPermissionFields = await pfObj.find({ filters: [['space', '=', spaceId], ['permission_set_id', '=', orininalPermissionSetName], ['permission_object', '=', poDoc.name]] }, userSession);
                //     // 遍历原有的字段权限
                //     for (const pfDoc of originalPermissionFields) {
                //         // 创建新的字段权限
                //         delete pfDoc._id;
                //         const newPermissionField = await pfObj.insert({
                //             ...pfDoc,
                //             ...baseInfo,
                //             permission_set_id: newPermissionSetName,
                //             permission_object_id: newPermissionObjectName
                //         });
                //     }
                // }
            }

        }

        res.status(200).send({ message: 'success' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error.message });
    }

});
exports.default = router;