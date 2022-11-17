/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-10-29 16:49:49
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-10-29 17:29:38
 * @Description: 权限集详情页中的设置选项卡权限按钮保存接口，批量保存选项卡权限
 */
'use strict';
// @ts-check

const express = require("express");
const router =require('@steedos/router').staticRouter()
const core = require('@steedos/core');
const objectql = require('@steedos/objectql');

/**
 * body {
 *  permission_set_name,
 *  permission_tabs_list: [
 *  {
 *      permission: on/off/hidden,
 *      tab: {
 *          _id,
 *          name,
 *          label
 *      }
 *  }
 *  ...
 * ]
 * }
 */
router.post('/api/permission/permission_set/batchSavePermissionTabs', core.requireAuthentication, async function (req, res) {
    try {
        const userSession = req.user;
        const { spaceId } = userSession;

        const { permission_set_name, permission_tabs_list } = req.body;
        if (!permission_tabs_list || !_.isArray(permission_tabs_list)) {
            throw new Error("permission_tabs_list is required");
        }
        const permissionTabsObj = objectql.getObject('permission_tabs')
        for (const { permission, tab } of permission_tabs_list) {
            const pTabDoc = (await permissionTabsObj.find({
                filters: [
                    ['permission_set', '=', permission_set_name],
                    ['tab', '=', tab.name]
                ]
            }))[0]

            if (pTabDoc && !pTabDoc.system) {
                // 如果存在
                // 1、非系统 执行更新
                await permissionTabsObj.update(pTabDoc._id, {
                    'permission': permission
                }, userSession)
            } else if (!pTabDoc || pTabDoc.system) {
                // 2、系统的执行新增，相当于自定义
                // 如果不存在，执行新增
                await permissionTabsObj.insert({
                    'space': spaceId,
                    'permission_set': permission_set_name,
                    'tab': tab.name,
                    'permission': permission
                }, userSession)
            }

        }

        res.status(200).send({
            "status": 0,
            "msg": "",
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            "status": 1,
            "msg": error.message,
        });
    }

});
exports.default = router;