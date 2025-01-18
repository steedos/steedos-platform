/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-12-02 16:53:23
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2025-01-17 16:29:29
 * @Description: 
 */
"use strict";
const { getObject } = require("@steedos/objectql")
const _ = require('underscore')
const lodash = require('lodash');

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
            // 这里要额外返回动态的__reloadTag值是因为amis crud嵌套列表模式在触发crud reload动作时默认只重新请求api接口不会自动刷新整个列表（比如不会自动重新请求已展开子节点deferApi），
            // 这里额外返回根节点数据跟前一次请求数据有变更的话，就能实现刷新整个crud，而不是只刷新根节点
            // 不会自动刷新整个列表的话，点击部门列表右上角的刷新按钮，或者编辑行记录保存后整个列表的数据就是老的没有即时刷新
            treeRecords.push(Object.assign({}, row, { defer: !!(children && children.length), __reloadTag: new Date().getTime() }));
        }
    });
    return treeRecords;
}

function getTreeRootIds(rows) {
    const valueField = "_id";
    const ids = [];
    for (var i = 0; i < rows.length; i++) {
        const row = rows[i];
        if (!!row["parent"]) {
            if (!lodash.some(rows, row2 => row["parent"] == row2[valueField])){
                ids.push(row._id);
            }
        } else {
            ids.push(row._id);
        };
    }
    return ids;
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
            params: {
                fields: { type: 'string', optional: true },
                filters: { type: 'string', optional: true },
            },
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
            console.log('getOrganizationsRootNode 1')
            const orgObj = getObject('organizations');

            let userFilters = null;

            if(ctx.params?.filters && lodash.isString(ctx.params.filters)){
                userFilters = JSON.parse(ctx.params.filters)
            }
            console.log('getOrganizationsRootNode 2')
            const orgs = await orgObj.find({filters: userFilters, fields: ['_id','parent', 'children']})
            const rootIds = getTreeRootIds(orgs)
            console.log('getOrganizationsRootNode 3')
            let queryFields = ctx.params?.fields || `
                _id,
                name,
                fullname,
                sort_no,
                hidden,
                _display:_ui{sort_no,hidden},
                parent,
                children
            `;
            const filters = ["_id", "in", rootIds];
            console.log('api.graphql 1', queryFields)
            let graphqlResult = await this.broker.call('api.graphql', {
              query: `
                query {
                  rows: organizations(filters: ${JSON.stringify(filters)},sort: \"sort_no desc\") {
                    ${queryFields}
                  }
                }
              `},
              {
                meta: {
                  user: ctx.meta.user
                }
              }
            )
            console.log('api.graphql 2', queryFields)
            let rootOrgs = graphqlResult.data.rows;
            return {
                data: {
                    rows: _.map(rootOrgs, (item)=>{
                        return {
                            ...item,
                            defer: !!(item.children && item.children.length),
                            __reloadTag: new Date().getTime()
                        }
                    }),
                    count: orgs.length
                }
            };
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
