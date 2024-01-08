/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-12-02 16:53:23
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2024-01-07 15:39:44
 * @Description: 
 */
"use strict";
const { getObject } = require("@steedos/objectql")
const _ = require('underscore')

/**
 * 
 * @param {*} rows rows内必须有value，parent，children
 * @returns 把扁平的数据转换为树状结构的数据
 * @options valueField为每一条记录的id
 */
function getTreeRoot(rows) {
    const valueField = "_id";
    const treeRecords = [];
    const getRoot = (rows) => {
        for (var i = 0; i < rows.length; i++) {
            rows[i].noParent = 0;
            if (!!rows[i]["parent"]) {
                let biaozhi = 1;
                for (var j = 0; j < rows.length; j++) {
                    if (rows[i]["parent"] == rows[j][valueField])
                        biaozhi = 0;
                }
                if (biaozhi == 1) rows[i].noParent = 1;
            } else rows[i].noParent = 1;
        }
    }
    getRoot(rows);
    _.each(rows, (row) => {
        if (row.noParent == 1) {
            let children = row["children"];
            delete row["noParent"];
            delete row["children"];
            // 按amis crud的deferApi规范，节点defer为true表示有子节点
            treeRecords.push(Object.assign({}, row, { defer: !!(children && children.length) }));
        }
    });
    return treeRecords;
}

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
module.exports = {
    name: 'organizations',
    namespace: "steedos",
    mixins: [],
    /**
     * Settings
     */
    settings: {

    },

    /**
     * Dependencies
     */
    dependencies: [],

    /**
     * Actions
     */
    actions: {
        /**
         * @api {post} calculateFullname 计算组织的全名
         * @apiName calculateFullname
         * @apiGroup organizations.service.js
         * @apiParam {String} orgId  组织ID
         * @apiSuccess {String} 返回组织的全名
         */
        calculateFullname: {
            params: {
                orgId: { type: "string" },
            },
            async handler(ctx) {
                this.broker.logger.info('[service][organizations]===>', 'calculateFullname', ctx.params.orgId)
                return this.calculateFullname(ctx.params.orgId)
            }
        },
        /**
         * @api {post} calculateParents 计算组织的父节点
         * @apiName calculateParents
         * @apiGroup organizations.service.js
         * @apiParam {String} orgId  组织ID
         * @apiSuccess {String[]} 返回组织的父节点
         */
        calculateParents: {
            params: {
                orgId: { type: "string" },
            },
            async handler(ctx) {
                this.broker.logger.info('[service][organizations]===>', 'calculateParents', ctx.params.orgId)
                return this.calculateParents(ctx.params.orgId)
            }
        },
        /**
         * @api {post} calculateChildren 计算组织的子节点
         * @apiName calculateChildren
         * @apiGroup organizations.service.js
         * @apiParam {String} orgId  组织ID
         * @apiSuccess {String[]} 返回组织的子节点
         */
        calculateChildren: {
            params: {
                orgId: { type: "string" },
            },
            async handler(ctx) {
                this.broker.logger.info('[service][organizations]===>', 'calculateChildren', ctx.params.orgId)
                return this.calculateChildren(ctx.params.orgId)
            }
        },
        /**
         * @api {post} updateUsers 更新组织成员
         * @apiName updateUsers
         * @apiGroup organizations.service.js
         * @apiParam {String} orgId  组织ID
         */
        updateUsers: {
            params: {
                orgId: { type: "string" },
            },
            async handler(ctx) {
                this.broker.logger.info('[service][organizations]===>', 'updateUsers', ctx.params.orgId)
                return this.updateUsers(ctx.params.orgId)
            }
        },
        /**
         * @api {post} calculateUsers 计算组织成员
         * @apiName calculateUsers
         * @apiGroup organizations.service.js
         * @apiParam {String} orgId  组织ID
         * @apiParam {Boolean} isIncludeParents 是否计算父组织
         * @apiSuccess {String[]} 成员IDs
         */
        calculateUsers: {
            params: {
                orgId: { type: "string" },
                isIncludeParents: { type: "boolean", optional: true },
            },
            async handler(ctx) {
                this.broker.logger.info('[service][organizations]===>', 'calculateUsers', ctx.params)
                return this.calculateUsers(ctx.params.orgId, ctx.params.isIncludeParents)
            }
        },
        getOrganizationsRootNode: {
        // 访问地址： GET /service/api/organizations/root
          rest: { method: 'GET', path: '/root' },
          async handler(ctx) {
            return this.getOrganizationsRootNode(ctx)
          }
        }
    },

    /**
     * Events
     */
    events: {

    },

    /**
     * Methods
     */
    methods: {
        /**
         * 计算组织的全名
         * @param {String} orgId 
         * @returns 组织的全名
         */
        async calculateFullname(orgId) {
            const orgObj = getObject('organizations')
            const orgDoc = await orgObj.findOne(orgId)
            let fullname = orgDoc.name;
            if (!orgDoc.parent) {
                return fullname;
            }
            let parentId = orgDoc.parent;
            while (parentId) {
                const parentOrg = await orgObj.findOne(parentId, { fields: ['parent', 'name'] });
                if (parentOrg) {
                    parentId = parentOrg.parent;
                } else {
                    parentId = null;
                }
                if (parentId) {
                    fullname = (parentOrg != null ? parentOrg.name : void 0) + "/" + fullname;
                }
            }
            return fullname;
        },

        /**
         * 计算组织父节点
         * @param {*} orgId 
         */
        async calculateParents(orgId) {
            const orgObj = getObject('organizations')
            const orgDoc = await orgObj.findOne(orgId)
            var parentId, parentOrg, parents;
            parents = [];
            if (!orgDoc.parent) {
                return parents;
            }
            parentId = orgDoc.parent;
            while (parentId) {
                parents.push(parentId);
                parentOrg = await orgObj.findOne(parentId, { fields: ['parent', 'name'] });
                if (parentOrg) {
                    parentId = parentOrg.parent;
                } else {
                    parentId = null;
                }
            }
            return parents;
        },
        /**
         * 计算组织的子节点
         * @param {*} orgId 
         */
        async calculateChildren(orgId) {
            const orgObj = getObject('organizations')
            var children, childrenObjs;
            children = [];
            childrenObjs = await orgObj.find({
                filters: [
                    ['parent', '=', orgId]
                ],
                fields: ['_id']
            });
            childrenObjs.forEach(function (child) {
                return children.push(child._id);
            });
            return children;
        },
        /**
         * 更新组织成员
         * @param {*} orgId 
         */
        async updateUsers(orgId) {
            const orgObj = getObject('organizations')
            const suObj = getObject('space_users')
            var spaceUsers, users;
            users = [];
            spaceUsers = await suObj.find({
                filters: [
                    ['organizations', '=', orgId]
                ],
                fields: ['user']
            });
            spaceUsers.forEach(function (su) {
                return users.push(su.user);
            });
            await orgObj.directUpdate(orgId, { users: users });
        },
        /**
         * 计算组织所有子节点
         * @param {*} orgId 
         * @returns 
         */
        async calculateAllChildren(orgId) {
            const orgObj = getObject('organizations')
            var children, childrenObjs;
            children = [];
            childrenObjs = await orgObj.find({
                filters: [
                    ['parents', '=', orgId]
                ],
                fields: ['_id']
            });
            childrenObjs.forEach(function (child) {
                return children.push(child._id);
            });
            return _.uniq(children);
        },
        /**
         * 计算组织成员
         * @param {*} orgId 
         * @param {*} isIncludeParents 
         */
        async calculateUsers(orgId, isIncludeParents) {
            const orgObj = getObject('organizations')
            var orgs, userOrgs, users;
            orgs = isIncludeParents ? (await this.calculateAllChildren(orgId)) : (await this.calculateChildren(orgId));
            orgs.push(orgId);
            users = [];
            userOrgs = await orgObj.find({
                filters: [
                    ['_id', 'in', orgs]
                ],
                fields: ['users']
            });
            userOrgs.forEach(function (org) {
                var ref;
                if (org != null ? (ref = org.users) != null ? ref.length : void 0 : void 0) {
                    return users = users.concat(org.users);
                }
            });
            return _.uniq(users);
        },

        /**
         * 从所有组织数据中算出当前用户有权限访问的根组织节点
         * @param {*} orgId 
         * @returns 
         */
        async getOrganizationsRootNode(ctx) {
            let graphqlResult = await this.broker.call('api.graphql', {
              query: `
                query {
                  rows: organizations(filters: [],sort: \"sort_no desc\") {
                    _id,
                    name,
                    sort_no,
                    hidden,
                    _display:_ui{sort_no,hidden},
                    parent,
                    children
                  }
                }
              `},
              {
                meta: {
                  user: ctx.meta.user
                }
              }
            )
            let orgs = graphqlResult.data.rows;
            graphqlResult.data.rows = getTreeRoot(orgs);
            return graphqlResult;
        }
    },

    /**
     * Service created lifecycle event handler
     */
    created() {

    },

    /**
     * Service started lifecycle event handler
     */
    async started() {
        this.broker.logger.info('[service][organizations]===>', 'started')
    },

    /**
     * Service stopped lifecycle event handler
     */
    async stopped() {

    }
};
