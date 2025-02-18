/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-12-02 16:53:23
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-09-20 10:51:35
 * @Description: 
 */
"use strict";
const _ = require("lodash");
const { getObject, getSteedosConfig } = require("@steedos/objectql")
const metadataCore = require('@steedos/metadata-core');
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
module.exports = {
    name: 'spaces',
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
         * @api {post} /api/v4/spaces/register/tenant 注册工作区
         * @apiName register_tenant
         * @apiGroup spaces.service.js
         * @apiParam {String} name 工作区名称
         * @apiSuccess {Object} 返回创建后的工作区记录
         */
        register_tenant: {
            rest: {
                method: "POST",
                fullPath: "/api/v4/spaces/register/tenant",
            },
            params: {
                name: { type: "string" }
            },
            async handler(ctx) {
                this.broker.logger.info('[service][spaces]===>', '/api/v4/spaces/register/tenant', ctx.params.name)
                return await this.register_tenant(ctx.params.name, ctx.meta.user)
            }
        },
        /**
         * @api {call} addSpaceUsers 工作区添加用户
         * @apiName addSpaceUsers
         * @apiGroup spaces.service.js
         * @apiParam {String} spaceId 工作区ID
         * @apiParam {String} userId 用户ID
         * @apiParam {Boolean} user_accepted 是否有效
         * @apiParam {String} organization_id 组织ID
         * @apiSuccess {Boolean} 是否添加成功
         */
        addSpaceUsers: {
            params: {
                spaceId: { type: "string" },
                userId: { type: "string" },
                user_accepted: { type: "boolean" },
                organization_id: { type: "string", optional: true },
            },
            async handler(ctx) {
                this.broker.logger.info('[service][spaces]===>', 'addSpaceUsers', ctx.params)
                return await this.addSpaceUsers(ctx.params.spaceId, ctx.params.userId, ctx.params.user_accepted, ctx.params.organization_id)
            }
        },
        /**
         * @api {call} isSpaceAdmin 是否工作区管理员
         * @apiName isSpaceAdmin
         * @apiGroup spaces.service.js
         * @apiParam {String} spaceId 工作区ID
         * @apiParam {String} userId 用户ID
         * @apiSuccess {Boolean} 是否工作区管理员
         */
        isSpaceAdmin: {
            params: {
                spaceId: { type: "string" },
                userId: { type: "string" },
            },
            async handler(ctx) {
                this.broker.logger.info('[service][spaces]===>', 'isSpaceAdmin', ctx.params)
                return await this.isSpaceAdmin(ctx.params.spaceId, ctx.params.userId)
            }
        },
        /**
         * @api {call} isSpaceOwner 是否工作区拥有者
         * @apiName isSpaceOwner
         * @apiGroup spaces.service.js
         * @apiParam {String} spaceId 工作区ID
         * @apiParam {String} userId 用户ID
         * @apiSuccess {Boolean} 是否工作区拥有者
         */
        isSpaceOwner: {
            params: {
                spaceId: { type: "string" },
                userId: { type: "string" },
            },
            async handler(ctx) {
                this.broker.logger.info('[service][spaces]===>', 'isSpaceOwner', ctx.params)
                return await this.isSpaceOwner(ctx.params.spaceId, ctx.params.userId)
            }
        },
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
         * 注册工作区
         */
        async register_tenant(spaceName, userSession) {
            const spaceObj = getObject('spaces')

            const config = getSteedosConfig();
            let tenant = {
                name: "Steedos",
                logo_url: undefined,
                background_url: undefined,
                enable_create_tenant: true,
                enable_register: true,
                enable_forget_password: true
            }

            if (config.tenant) {
                _.assignIn(tenant, config.tenant)
            }

            if (!tenant.enable_create_tenant) {
                throw new Error(500, "禁止注册企业")
            }

            if (!spaceName) {
                throw new Error("名称不能为空")
            }

            if (userSession) {
                const userId = userSession.userId
                const spaceId = await spaceObj._makeNewID()
                const spaceDoc = {
                    _id: spaceId,
                    space: spaceId,
                    name: spaceName,
                    owner: userId
                }

                await spaceObj.insert(spaceDoc);
                const newSpace = await spaceObj.findOne(spaceId);
                return newSpace
            } else {
                if (!userSession) {
                    throw new Error(401, "");
                }
            }
        },
        /**
         * 工作区添加用户
         */
        async addSpaceUsers(spaceId, userId, user_accepted, organization_id) {
            const now = new Date();
            const suObj = getObject('space_users');
            const spaceObj = getObject('spaces')
            const orgObj = getObject('organizations')

            const suDoc = (await suObj.directFind({
                filters: [
                    ['space', '=', spaceId],
                    ['user', '=', userId]
                ]
            }))[0]
            // 如果工作区已存在此用户则不重复添加
            if (suDoc) {
                return;
            }

            let profile = process.env.STEEDOS_TENANT_REGISTER_DEFAULT_PROFILE || 'user';

            const space = await spaceObj.findOne(spaceId, { fields: ['default_profile', 'default_organization'] })
            if (space) {
                if (space.default_profile) {
                    profile = space.default_profile
                }
                if (!organization_id && space.default_organization) {
                    organization_id = space.default_organization
                }
            }

            if(process.env.STEEDOS_TENANT_REGISTER_PROFILE ){
                profile = process.env.STEEDOS_TENANT_REGISTER_PROFILE;
            }

            if (!organization_id) {
                const rootOrg = (await orgObj.find({
                    filters: [
                        ['space', '=', spaceId],
                        ['parent', '=', null]
                    ]
                }))[0]
                organization_id = rootOrg._id
            }

            //company_id,company_ids,organizations_parents由triggers维护
            const spaceUsersDoc = {
                user: userId,
                user_accepted: user_accepted,
                organization: organization_id,
                organizations: [organization_id],
                profile: profile,
                space: spaceId,
                owner: userId,
                created_by: userId,
                created: now,
                modified_by: userId,
                modified: now
            }
            const newsuDoc = await suObj.insert(spaceUsersDoc)

            if (await this.isSpaceAdmin(spaceId, userId)) {
                await suObj.directUpdate(newsuDoc._id, {
                    profile: 'admin'
                })
            }
            // 如果开发环境且创建第一条space_users记录时, 自动生成api key 并写入.env.local 文件
            if (process.env.NODE_ENV != 'production' && (await suObj.count({ filters: [['space', '=', spaceId]] })) === 1) {
                // 创建api key
                getObject('api_keys').insert({
                    api_key: process.env.STEEDOS_INITIAL_API_KEY || Random.secret(),
                    space: spaceId,
                    owner: userId,
                    active: true
                }).then(function (record) {
                    // 写入.env.local 文件
                    const rootUrl = metadataCore.getRootUrl();
                    if (!rootUrl) {
                        rootUrl = process.env.ROOT_URL
                    }
                    if (!rootUrl) {
                        rootUrl = 'http://localhost:5000'
                    }
                    const server = rootUrl
                    if (!server.startsWith('http')) {
                        server = `http://${server}`
                    }
                    if (server.endsWith('/')) {
                        server = server.substring(0, server.length - 1);
                    }
                    metadataCore.saveSourceConfig({
                        server: server,
                        apikey: record.api_key
                    })
                }).catch(function (error) {
                    console.log(error)
                })
            }
            return true;
        },

        /**
         * 是否工作区管理员
         * @param {*} spaceId 
         * @param {*} userId 
         * @return boolean
         */
        async isSpaceAdmin(spaceId, userId) {
            const spaceObj = getObject('spaces')
            const space = await spaceObj.findOne(spaceId, { fields: ['admins'] })
            if (space && space.admins) {
                return space.admins.indexOf(userId) >= 0
            }
            return false
        },
        /**
         * 是否工作区拥有者
         * @param {*} spaceId 
         * @param {*} userId 
         * @return boolean
         */
        async isSpaceOwner(spaceId, userId) {
            const spaceObj = getObject('spaces')
            const count = await spaceObj.count({filters: [['_id', '=', spaceId], ['owner', '=', userId]]})
            return count > 0
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
        this.broker.logger.info('[service][spaces]===>', 'started')
    },

    /**
     * Service stopped lifecycle event handler
     */
    async stopped() {

    }
};
