/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-05-26 16:56:54
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2023-04-25 17:13:09
 * @Description: 复制已有简档来创建新简档
 */
'use strict';
// @ts-check

const express = require("express");
const router = express.Router();
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
        const ptObj = objectql.getObject('permission_tabs');

        // const originalPermissionSet = (await psObj.find({ filters:[  ['name', '=',  originalPermissionSetId], ['space', '=', spaceId] ] }, userSession))[0]

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
        let newPermissionSetData = {
            ...originalPermissionSet,
            ...baseInfo,  
            is_system: false,
            name,
            label
        };

        delete newPermissionSetData._id;
        delete newPermissionSetData.record_permissions;
        const newPermissionSet = await psObj.insert(newPermissionSetData);


        // 创建对象权限和选项卡权限
        if (newPermissionSet) {
            const orininalPermissionSetName = originalPermissionSet.name;
            const { _id: newPermissionSetId, name: newPermissionSetName } = newPermissionSet;
            const originalPermissionObjects = await poObj.find({ filters: [['space', '=', spaceId], ['permission_set_id', '=', originalPermissionSetId]] }, userSession);
            // 遍历原有的对象权限
            for (const poDoc of originalPermissionObjects) {
                // 创建新的对象权限
                delete poDoc._id;
                const newPermissionObject = await poObj.directInsert({
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


            // 创建选项卡权限
            const originalPermissionTabs = await ptObj.find({ filters: [['space', '=', spaceId], ['permission_set', '=', originalPermissionSet.name]] }, userSession);
            // 遍历原有的选项卡权限
            for (const ptDoc of originalPermissionTabs) {
                delete ptDoc._id;
                ptDoc.permission_set = name;
                const newPermissionTabs = await ptObj.directInsert({
                    ...ptDoc,
                    ...baseInfo,
                });
            }

        }

        res.status(200).send({ 
            message: 'success' , 
            recordId: newPermissionSet._id
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error.message });
    }

});
exports.default = router;