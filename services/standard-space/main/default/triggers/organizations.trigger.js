/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-12-06 15:30:08
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2023-03-28 16:50:27
 * @Description: 
 */
"use strict";
// @ts-check
const { getObject, getSteedosSchema } = require('@steedos/objectql');
const _ = require("underscore");

async function checkHasOrgAdminPermission(org, userId) {
    const orgObj = getObject('organizations')
    const companyObj = getObject('company')
    let result = false;
    if (typeof org === "string") {
        org = await orgObj.findOne(org);
        if (!org) {
            throw new Error(`checkHasOrgAdminPermission organizations for '${org}' is not found`);
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
        const { doc, id, userId } = this
        const orgObj = getObject('organizations')
        const spaceObj = getObject('spaces')
        const beforeUpdateDoc = await orgObj.findOne(id)
        var isOrgAdmin, isParentOrgAdmin, isSpaceAdmin, parent, parentOrg, ref, ref1, space;
        space = await spaceObj.findOne(beforeUpdateDoc.space);
        if (!space) {
            throw new Error("organizations_error_space_not_found");
        }
        isSpaceAdmin = space.admins.indexOf(userId) >= 0;
        /*
            非工作区管理员修改部门，需要以下权限：
            1.需要有原组织或原组织的父组织的管理员权限
            2.需要有改动后的父组织的权限
        */
        if (!isSpaceAdmin) {
            isOrgAdmin = await checkHasOrgAdminPermission(id, userId);
            if (!isOrgAdmin) {
                throw new Error("organizations_error_org_admins_only");
            }
            if (((ref = doc) != null ? ref.parent : void 0) && ((ref1 = doc) != null ? ref1.parent : void 0) !== beforeUpdateDoc.parent) {
                isParentOrgAdmin = await checkHasOrgAdminPermission(doc.parent, userId);
                if (!isParentOrgAdmin) {
                    throw new Error("您没有该上级部门的权限");
                }
            }
        }
        if (doc.space && beforeUpdateDoc.space !== doc.space) {
            throw new Error("organizations_error_space_readonly");
        }
        
        if (doc.parents && !_.isEqual(beforeUpdateDoc.parents, doc.parents)) {
            throw new Error("organizations_error_parents_readonly");
        }
        if (doc.children && !_.isEqual(beforeUpdateDoc.children, doc.children)) {
            throw new Error("organizations_error_children_readonly");
        }
        if (doc.fullname && !_.isEqual(beforeUpdateDoc.fullname, doc.fullname)) {
            throw new Error("organizations_error_fullname_readonly");
        }

        if (beforeUpdateDoc.parent) {
            // 公司级的部门的父部门必须也是公司级的部门
            parent = doc.parent || beforeUpdateDoc.parent;
            parentOrg = await orgObj.findOne(parent);
            if (!parentOrg) {
                throw new Error("organizations_error_parent_is_not_found");
            }
        } else {
            if (doc.parent) {
                throw new Error("organizations_error_root_parent_can_not_set");
            }
        }
        doc.modified_by = userId;
        doc.modified = new Date();
        if (doc.parent) {
            // parent 不能等于自己或者 children
            parentOrg = parentOrg ? parentOrg : await orgObj.findOne(doc.parent);
            if (!parentOrg) {
                throw new Error("organizations_error_parent_is_not_found");
            }
            if (id === parentOrg._id || (parentOrg.parents && parentOrg.parents.indexOf(id) >= 0)) {
                throw new Error("organizations_error_parent_is_self");
            }

        }
        // 这里增加beforeUpdateDoc.parent判断是因为编辑根组织时doc.parent为空，通过beforeUpdateDoc.parent来判断原来是否有父组织来区别下
        if (beforeUpdateDoc.parent && _.has(doc, 'parent') && !doc.parent) {
            // 原来有parent, 并且$set 中有parent，并且值为空
            throw new Error("organizations_error_organizations_parent_required");
        }

        if (_.has(doc, 'name') && !doc.name) {
            throw new Error("organizations_error_organization_name_required");
        }
    },

    beforeDelete: async function () {
        const { id, userId } = this
        const spaceObj = getObject('spaces')
        const orgObj = getObject('organizations')
        const doc = await orgObj.findOne(id)
        var isOrgAdmin, isSpaceAdmin, space;
        // check space exists
        space = await spaceObj.findOne(doc.space);
        if (!space) {
            throw new Error("organizations_error_space_not_found");
        }
        isSpaceAdmin = space.admins.indexOf(userId) >= 0;
        // only space admin or org admin can remove organizations
        if (!isSpaceAdmin) {
            isOrgAdmin = await checkHasOrgAdminPermission(doc, userId);
            if (!isOrgAdmin) {
                throw new Error("organizations_error_org_admins_only");
            }
        }
        // can not delete organization with children
        if (doc.children && doc.children.length > 0) {
            throw new Error("organizations_error_organization_has_children");
        }
        if (doc.users && doc.users.length > 0) {
            throw new Error("organizations_error_organization_has_users");
        }
        if (!doc.parent) {
            throw new Error("organizations_error_can_not_remove_root_organization");
        }
    },

    afterInsert: async function () {
        const { doc } = this
        const orgObj = getObject('organizations')
        const suObj = getObject('space_users')
        const broker = getSteedosSchema().broker
        var obj, parent, rootOrg, space_users, updateFields;
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
        const { doc, id, userId, previousDoc } = this
        const orgObj = getObject('organizations')
        const spaceObj = getObject('spaces')
        const suObj = getObject('space_users')
        const broker = getSteedosSchema().broker
        const afterUpdateDoc = await orgObj.findOne(id)
        var added_space_users, added_users, children, newParent, new_users, obj, oldParent, old_users, removed_space_users, removed_users, rootOrg, sUser, updateFields, updatedDoc;
        updateFields = {};
        obj = orgObj.findOne(id);
        if (obj.parent) {
            updateFields.parents = await broker.call('organizations.calculateParents', { orgId: id })
        }
        if (doc.parent) {
            newParent = await orgObj.findOne(afterUpdateDoc.parent);
            await orgObj.directUpdate(newParent._id, {
                children: await broker.call('organizations.calculateChildren', { orgId: newParent._id })
            });
            oldParent = await orgObj.find({
                filters: [
                    ['children', '=', id]
                ]
            });
            for (const organization of oldParent) {
                let existed = await orgObj.count({
                    filters: [
                        ['_id', '=', id],
                        ['parent', '=', organization._id]
                    ]
                });
                if (existed === 0) {
                    organization.children.splice(organization.children.indexOf(id), 1)
                    await orgObj.directUpdate(organization._id, {
                        children: organization.children
                    });
                }
            }
        }
        // 如果更改 parent 或 name, 需要更新 自己和孩子们的 fullname
        if (doc.parent || doc.name) {
            updateFields.fullname = await broker.call('organizations.calculateFullname', { orgId: id })
            children = await orgObj.find({
                filters: [
                    ['parents', '=', id]
                ]
            });
            for (const child of children) {
                const childId = child._id
                let childSet = {
                    fullname: await broker.call('organizations.calculateFullname', { orgId: childId })
                };
                if (doc.parent) {
                    childSet.parents = await broker.call('organizations.calculateParents', { orgId: childId })
                }
                await orgObj.directUpdate(childId, childSet)
            }
        }
        if (!_.isEmpty(updateFields)) {
            await orgObj.directUpdate(id, updateFields);
        }
        old_users = previousDoc.users || [];
        new_users = doc.users || [];
        // 只修改单个字段时，doc.users可能是undefined
        if (!rootOrg) {
            rootOrg = (await orgObj.find({
                filters: [
                    ['space', '=', afterUpdateDoc.space],
                    ['parent', '=', null]
                ],
                fields: ['_id']
            }))[0];
        }
        if (doc.users) {
            added_users = _.difference(new_users, old_users);
            removed_users = _.difference(old_users, new_users);
            if (added_users.length > 0) {
                added_space_users = await suObj.find({
                    filters: [
                        ['space', '=', afterUpdateDoc.space],
                        ['user', 'in', added_users]
                    ],
                    fields: ['organizations', 'company_id', 'space']
                });
                for (const su of added_space_users) {
                    let orgs = su.organizations || [];
                    orgs.push(id);
                    await suObj.directUpdate(su._id, {
                        organizations: orgs
                    })
                    await broker.call('space_users.update_organizations_parents', { suId: su._id, orgIds: orgs })
                }
            }
            if (removed_users.length > 0) {
                removed_space_users = await suObj.find({
                    filters: [
                        ['space', '=', afterUpdateDoc.space],
                        ['user', 'in', removed_users]
                    ],
                    fields: ['organization', 'organizations', 'company_id', 'space']
                });
                for (const su of removed_space_users) {
                    let new_orgs, orgs, top_organization;
                    // 删除部门成员时，如果修改了其organization，则其company_id值应该同步改为其对应的organization.company_id值
                    orgs = su.organizations;
                    if (orgs.length === 1) {
                        await suObj.directUpdate(su._id, {
                            organizations: [rootOrg._id],
                            organization: rootOrg._id,
                            company_id: rootOrg._id
                        })
                        await broker.call('space_users.update_organizations_parents', { suId: su._id, orgIds: [rootOrg._id] })
                    } else if (orgs.length > 1) {
                        new_orgs = _.filter(orgs, function (org_id) {
                            return org_id !== id;
                        });
                        if (su.organization === id) {
                            top_organization = await orgObj.findOne(new_orgs[0], {
                                fields: ['company_id']
                            });
                            await suObj.directUpdate(su._id, {
                                organizations: new_orgs,
                                organization: new_orgs[0],
                                company_id: top_organization.company_id
                            })
                        } else {
                            await suObj.directUpdate(su._id, {
                                organizations: new_orgs,
                            })
                        }
                        await broker.call('space_users.update_organizations_parents', { suId: su._id, orgIds: new_orgs })
                    }
                };
            }
        }
        //修改部门的parent时, 需要其space_user的organizations_parents
        if (doc.parent) {
            children = await orgObj.find({
                filters: [
                    ['parents', '=', id]
                ],
                fields: ['_id']
            });
            for (const child of children) {
                let childUsers = await suObj.find({
                    filters: [
                        ['organizations', '=', child._id]
                    ],
                    fields: ['_id', 'organizations']
                });
                for (const su of childUsers) {
                    await broker.call('space_users.update_organizations_parents', { suId: su._id, orgIds: su.organizations })
                }
            }
        }
        if (doc.name && doc.name !== previousDoc.name && !afterUpdateDoc.parent) {
            // 根组织名称变更时同步更新工作区名称
            await spaceObj.directUpdate(afterUpdateDoc.space, {
                name: doc.name
            })
        }

    },

    afterDelete: async function () {
        const { previousDoc } = this
        const orgObj = getObject('organizations')
        const parentId = previousDoc.parent
        if (parentId) {
            const broker = getSteedosSchema().broker
            await orgObj.directUpdate(parentId, {
                children: await broker.call('organizations.calculateChildren', { orgId: parentId })
            });
        }
    },

}