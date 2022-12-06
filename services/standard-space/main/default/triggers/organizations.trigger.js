/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-12-06 15:30:08
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-12-06 19:49:53
 * @Description: 
 */
const { getObject, getSteedosSchema } = require('@steedos/objectql');
const _ = require("lodash");

async function checkHasOrgAdminPermission(org, userId) {
    const orgObj = getObject('organizations')
    const companyObj = getObject('company')
    let result = false;
    if (typeof org === "string") {
        org = await orgObj.findOne(org);
        if (!org) {
            throw new Error(400, `checkHasOrgAdminPermission organizations for '${org}' is not found`);
        }
    }
    let parents = org != null ? org.parents : void 0;
    if (parents) {
        parents.push(org._id);
    } else {
        parents = [org._id];
    }
    const adminCompanyCount = await companyObj.count({
        filters: [
            ['organization', 'in', parents],
            ['admins', '=', userId]
        ]
    })
    if (adminCompanyCount > 0) {
        result = true;
    }
    return result;
}

module.exports = {
    listenTo: 'organizations',

    beforeInsert: async function () {
        const { doc, userId } = this
        const spaceObj = getObject('spaces')
        const orgObj = getObject('organizations')
        var broexisted, isOrgAdmin, isSpaceAdmin, parentOrg, space;
        if (!userId && doc.owner) {
            userId = doc.owner;
        }
        doc.created_by = userId;
        doc.created = new Date();
        doc.modified_by = userId;
        doc.modified = new Date();
        if (!doc.space) {
            throw new Error("organizations_error_space_required");
        }
        space = await spaceObj.findOne(doc.space);
        if (!space) {
            throw new Error("organizations_error_space_not_found");
        }
        isSpaceAdmin = space.admins.indexOf(userId) >= 0;
        // only space admin or org admin can insert organizations
        if (!isSpaceAdmin) {
            isOrgAdmin = false;
            if (doc.parent) {
                parentOrg = await orgObj.findOne(doc.parent);
                if (!parentOrg) {
                    throw new Error("organizations_error_parent_is_not_found");
                }
                isOrgAdmin = await checkHasOrgAdminPermission(parentOrg, userId);
            } else {
                // 注册用户的时候会触发"before.insert"，且其userId为underfined，所以这里需要通过parent为空来判断是否是新注册用户时进该函数。
                isOrgAdmin = true;
            }
            if (!isOrgAdmin) {
                throw new Error("organizations_error_org_admins_only");
            }
        }

        // 同一个space中不能有同名的organization，parent 不能有同名的 child
        if (doc.parent) {
            parentOrg = parentOrg ? parentOrg : (await orgObj.findOne(doc.parent));
            if (!parentOrg) {
                throw new Error("organizations_error_parent_is_not_found");
            }

            if (!doc.company_id) {
                // 新增组织时，自动继承上级组织的 company_id
                doc.company_id = parentOrg.company_id;
            }
        } else {
            // 新增部门时不允许创建根部门
            broexisted = await orgObj.count({
                filters: [
                    ['space', '=', doc.space]
                ]
            })
            if (broexisted > 0) {
                throw new Error("organizations_error_organizations_parent_required");
            }

        }
    },

    beforeUpdate: async function () {

    },

    beforeDelete: async function () {

    },

    afterInsert: async function () {
        const { doc } = this
        const orgObj = getObject('organizations')
        const suObj = getObject('space_users')
        const broker = getSteedosSchema().broker
        var obj, parent, rootOrg, sUser, space_users, updateFields;
        updateFields = {};
        const orgId = doc._id
        obj = await orgObj.findOne(orgId);
        updateFields.parents = await broker.call('organizations.calculateParents', { orgId: orgId })
        updateFields.fullname = await broker.call('organizations.calculateFullname', { orgId: orgId })
        if (!_.isEmpty(updateFields)) {
            await orgObj.directUpdate(orgId, updateFields)
        }
        if (doc.parent) {
            parent = await orgObj.findOne(doc.parent);
            const children = await broker.call('organizations.calculateChildren', { orgId: parent._id })
            await orgObj.directUpdate(parent._id, {
                children: children
            })
        }
        if (!rootOrg) {
            rootOrg = (await orgObj.find({
                filters: [
                    ['space', '=', doc.space],
                    ['parent', '=', null]
                ],
                fields: ['_id']
            }))[0];
        }
        if (doc.users) {
            space_users = await suObj.find({
                filters: [
                    ['space', '=', doc.space],
                    ['user', 'in', doc.users]
                ],
                fields: ['organizations', 'company_id', 'space']
            });
            for (const su of space_users) {
                let orgs = su.organizations;
                orgs.push(doc._id);
                await suObj.directUpdate(su._id, {
                    organizations: orgs
                })

                await broker.call('space_users.update_organizations_parents', { suId: su._id, orgIds: orgs })
            }
        }

    },

    afterUpdate: async function () {

    },

    afterDelete: async function () {

    },

}