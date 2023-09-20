/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-12-03 11:19:39
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-09-20 14:04:26
 * @Description: 
 */
"use strict";
// @ts-check

const objectql = require('@steedos/objectql');
const validator = require('validator');
const _ = require("lodash");

module.exports = {
    listenTo: 'spaces',

    beforeInsert: async function () {
        let { doc, userId } = this
        if (!userId && doc.owner) {
            userId = doc.owner;
        }
        doc.created_by = userId;
        doc.created = new Date();
        doc.modified_by = userId;
        doc.modified = new Date();
        doc.enable_register = false;
        doc.services = doc.services || {};
        if (!userId) {
            throw new Error("spaces_error_login_required");
        }

        if (doc._id) {
            doc.space = doc._id
        }

        doc.owner = userId;
        return doc.admins = [userId];
    },

    beforeUpdate: async function () {
        const { doc, userId, id } = this
        const spaceDoc = await objectql.getObject('spaces').findOne(id)
        if (userId && (spaceDoc.owner !== userId)) {
            throw new Error("spaces_error_space_owner_only");
        }
        if (doc.owner) {
            if (!doc.admins) {
                doc.admins = doc.admins;
            } else if (doc.admins.indexOf(doc.owner) < 0) {
                return doc.admins.push(doc.owner);
            }
        }

        if (_.has(doc, 'admins') && _.isEmpty(doc.admins)) {
            throw new Error("spaces_error_space_admins_required");
        }
    },

    beforeDelete: async function () {
        throw new Error("spaces_error_space_readonly");
    },

    afterInsert: async function () {
        const { doc: spaceDoc } = this
        const spaceObj = objectql.getObject('spaces')
        // 创建第一个space时, 更新Tenant配置
        const spaces = await spaceObj.count({});
        if (spaces === 1) {
            const config = objectql.getSteedosConfig();
            process.env.STEEDOS_TENANT_ID = spaceDoc._id;
            config.setTenant({ _id: spaceDoc._id, enable_create_tenant: validator.toBoolean(process.env.STEEDOS_TENANT_ENABLE_SAAS || 'false', true), enable_register: spaceDoc.enable_register });
        }

        let spaceName = spaceDoc.name;
        let spaceId = spaceDoc._id;
        let userId = spaceDoc.owner;
        let now = new Date();

        let companyDB = objectql.getObject('company')
        let companyDoc = {
            _id: spaceId,
            name: spaceName,
            organization: spaceId,
            company_id: spaceId,
            space: spaceId,
            owner: userId,
            created_by: userId,
            created: now,
            modified_by: userId,
            modified: now
        }
        // 新建分部
        await companyDB.directInsert(companyDoc);

        let orgDB = objectql.getObject('organizations')
        let orgDoc = {
            _id: spaceId,
            name: spaceName,
            fullname: spaceName,
            is_company: true,
            users: [userId],
            company_id: spaceId,
            space: spaceId,
            owner: userId,
            created_by: userId,
            created: now,
            modified_by: userId,
            modified: now
        }
        // 新建根组织
        await orgDB.directInsert(orgDoc);

        // 新建用户
        await objectql.getSteedosSchema().broker.call(`spaces.addSpaceUsers`, {
            spaceId,
            userId,
            user_accepted: true,
            organization_id: orgDoc._id
        })

        // 发出工作区初始化完成事件
        objectql.broker.emit(`space.initialized`, spaceDoc);
    },

    afterUpdate: async function () {
        const { doc, id, previousDoc } = this
        const orgObj = objectql.getObject('organizations')
        const suObj = objectql.getObject('space_users')
        const spaceObj = objectql.getObject('spaces')
        // 工作区修改后，该工作区的根部门的name也要修改，根部门和子部门的fullname也要修改
        if (doc.name) {
            const spaceDoc = await spaceObj.findOne(id)
            // 直接修改根部门名字，跳过验证
            const rootOrg = (await orgObj.find({
                filters: [
                    ['space', '=', id],
                    ['parent', '=', null]
                ]
            }))[0]

            await orgObj.directUpdate(rootOrg._id, {
                name: spaceDoc.name,
                fullname: spaceDoc.name
            })

            const children = await orgObj.find({
                filters: [
                    ['parents', '=', rootOrg._id]
                ]
            });

            const broker = objectql.getSteedosSchema().broker
            for (const child of children) {
                const childFullname = await broker.call('organizations.calculateFullname', { orgId: child._id })
                await orgObj.directUpdate(child._id, {
                    fullname: childFullname
                })
            }
        }

        if (_.has(doc, 'admins')) {
            const setAdmins = doc.admins || []
            const removedAdmin = _.difference(previousDoc.admins, setAdmins);
            if (!_.isEmpty(removedAdmin)) {
                await suObj.updateMany([
                    ['space', '=', id],
                    ['user', 'in', removedAdmin]
                ], {
                    profile: 'user'
                })
            }
            const addedAdmin = _.difference(setAdmins, previousDoc.admins);
            if (!_.isEmpty(addedAdmin)) {
                await suObj.updateMany([
                    ['space', '=', id],
                    ['user', 'in', addedAdmin]
                ], {
                    profile: 'admin'
                })
            }
        }
    },

    afterDelete: async function () {

    },

}