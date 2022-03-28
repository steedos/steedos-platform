/*
 * @Author: sunhaolin@hotoa.com 
 * @Date: 2022-03-24 16:34:52 
 * @Last Modified by: sunhaolin@hotoa.com
 * @Last Modified time: 2022-03-27 22:24:48
 * @Description 提供process相关操作
 */
"use strict";
// @ts-check

const project = require('../../../package.json');
const packageName = project.name;
const objectql = require('@steedos/objectql');
const _ = require('lodash');
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
module.exports = {
    name: packageName,
    namespace: "steedos",
    mixins: [],
    /**
     * Settings
     */
    settings: {
        packageInfo: {
            path: __dirname,
            name: packageName
        }
    },

    /**
     * Dependencies
     */
    dependencies: ['metadata'],

    /**
     * Actions
     */
    actions: {
        // 保存schema，process最新版（process_versions）未启用则保存，如已启用则生成新版本
        save: {
            rest: {
                method: "POST",
                path: "/save"
            },
            params: {
                process: {
                    type: 'object',
                    props: {
                        _id: { type: 'string' },
                        name: { type: 'string' },
                        api_name: { type: 'string' },
                        entry_criteria: { type: 'string' },
                        schema: { type: 'string' },
                        when: { type: 'string' },
                        description: { type: 'string', optional: '' }
                    }
                }
            },
            handler: async function (ctx) {
                // call engine action
                const { process } = ctx.params;
                const { _id, description, entry_criteria, schema, when } = process;
                const userSession = ctx.meta.user;
                const { spaceId, company_id } = userSession;
                const processObj = objectql.getObject('process');
                const processDoc = await processObj.findOne(_id);
                const processVersionsObj = objectql.getObject('process_versions');
                const versionDocs = await processVersionsObj.find({ filters: [['space', '=', spaceId], ['process', '=', _id]], sort: 'version desc', top: 1 });
                const baseInfo = {
                    space: spaceId,
                    company_id: company_id
                };
                if (_.isEmpty(versionDocs)) { // 如果没有版本，则生成第一个版本。
                    const newVersionDoc = {
                        process: _id,
                        description: description,
                        entry_criteria: entry_criteria,
                        schema: schema,
                        when: when,
                        version: 1,
                        ...baseInfo
                    };
                    await processVersionsObj.insert(newVersionDoc, userSession);
                } else { // 如果有版本，则判断最新的版本是否已发布，如已发布，则生成新版本；如未发布，则更新schema。
                    const lastVersion = versionDocs[0];
                    if (lastVersion.is_active) {
                        const newVersionDoc = {
                            process: _id,
                            description: description,
                            entry_criteria: entry_criteria,
                            schema: schema,
                            when: when,
                            version: lastVersion.version + 1,
                            ...baseInfo
                        };
                        await processVersionsObj.insert(newVersionDoc, userSession);
                    } else {
                        await processVersionsObj.update(lastVersion._id, {
                            description: description,
                            entry_criteria: entry_criteria,
                            schema: schema,
                            when: when,
                        }, userSession);
                    }
                }
                const newProcess = {
                    ...processDoc,
                    entry_criteria: entry_criteria,
                    schema: schema,
                    when: when,
                }
                await ctx.call(`${processDoc.engine}.save`, { process: newProcess, operator: userSession });
                return { success: true }
            }
        },

        // 流程获取
        get: {
            rest: {
                method: "POST",
                path: "/get"
            },
            params: {
                _id: { type: 'string' }
            },
            handler: async function (ctx) {
                // call process.engine.start
                const { _id } = ctx.params;
                const userSession = ctx.meta.user;
                const { spaceId } = userSession;
                const processObj = objectql.getObject('process');
                const processVersionsObj = objectql.getObject('process_versions');
                let processDoc = await processObj.findOne(_id);
                // 如果已经有版本，则查找最新流程版本，合并返回
                const versionDocs = await processVersionsObj.find({ filters: [['space', '=', spaceId], ['process', '=', _id]], sort: 'version desc', top: 1 });
                const lastVersion = versionDocs[0];
                if (lastVersion) {
                    processDoc = {
                        ...processDoc,
                        schema: lastVersion.schema,
                    }
                }
                return processDoc;

            }
        },

        // 流程发布
        deploy: {
            rest: {
                method: "POST",
                path: "/deploy"
            },
            params: {
                _id: { type: 'string' } // 流程ID
            },
            handler: async function (ctx) {
                // call engine action
                const { _id } = ctx.params;
                const userSession = ctx.meta.user;
                const { spaceId } = userSession;
                const processObj = objectql.getObject('process');
                const processVersionsObj = objectql.getObject('process_versions');
                const processDoc = await processObj.findOne(_id);
                await ctx.call(`${processDoc.engine}.deploy`, { process: processDoc, operator: userSession });
                const versionDocs = await processVersionsObj.find({ filters: [['space', '=', spaceId], ['process', '=', _id]], sort: 'version desc', top: 1 });
                const lastVersion = versionDocs[0];
                await processVersionsObj.update(lastVersion._id, { is_active: true }, userSession);
                return { sucess: true }
            }
        },

        // 流程启用
        enable: {
            rest: {
                method: "POST",
                path: "/enable"
            },
            params: {
                _id: { type: 'string' }
            },
            handler: async function (ctx) {
                // call engine action
                const { _id } = ctx.params;
                const userSession = ctx.meta.user;
                const processObj = objectql.getObject('process');
                await processObj.update(_id, { is_active: true }, userSession);
                // 调用引擎action的逻辑在触发器中，支持页面编辑状态字段
                return { sucess: true }
            }
        },

        // 流程禁用
        disable: {
            rest: {
                method: "POST",
                path: "/disable"
            },
            params: {
                _id: { type: 'string' }
            },
            handler: async function (ctx) {
                // call engine action
                const { _id } = ctx.params;
                const userSession = ctx.meta.user;
                const processObj = objectql.getObject('process');
                await processObj.update(_id, { is_active: false }, userSession);
                // 调用引擎action的逻辑在触发器中，支持页面编辑状态字段
                return { sucess: true }
            }
        },

        // 流程删除
        delete: {
            rest: {
                method: "POST",
                path: "/delete"
            },
            params: {},
            handler: async function (ctx) {
                // call engine action
                const { _id } = ctx.params;
                const userSession = ctx.meta.user;
                const processObj = objectql.getObject('process');
                const processDoc = await processObj.findOne(_id);
                await processObj.delete(_id, userSession);
                await ctx.call(`${process.engine}.delete`, { process: processDoc, operator: userSession });

            }
        },

        // 流程发起
        start: {
            rest: {
                method: "POST",
                path: "/start"
            },
            params: {
                process_id: { type: 'string' },
                record_id: { type: 'string' },
                user: { type: 'object' }
            },
            handler: async function (ctx) {
                // call process.engine.start
                const { process_id, record_id, user } = ctx.params;
                const processObj = objectql.getObject('process');
                const processDoc = await processObj.findOne(process_id);
                const recordObj = await objectql.getObject(processDoc.object_name);
                const record = await recordObj.findOne(record_id);
                await ctx.call(`${processDoc.engine}.start`, { process: processDoc, record: record, operator: user });

            }
        },

        // 流程取消前
        beforeCancel: {
            rest: {
                method: "POST",
                path: "/beforeCancel"
            },
            params: {},
            handler: async function (ctx) {
                // 调用 Steedos 流程触发器脚本。
                return await broker.call('process.beforeCancel', { event, context })

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

    },

    /**
     * Service created lifecycle event handler
     */
    async created() {

    },

    /**
     * Service started lifecycle event handler
     */
    async started() {

    },

    /**
     * Service stopped lifecycle event handler
     */
    async stopped() {

    }
}