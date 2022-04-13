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
                        label: { type: 'string' },
                        entry_criteria: { type: 'string' },
                        schema: { type: 'string', optional: true },
                        when: { type: 'string' },
                        description: { type: 'string', optional: true }
                    }
                }
            },
            handler: async function (ctx) {
                // call engine action
                const { process } = ctx.params;
                const { _id, description, entry_criteria, schema, when } = process;
                const userSession = ctx.meta.user;
                if (!userSession) {
                    return;
                }
                const { spaceId, company_id } = userSession;
                const processObj = objectql.getObject('process');
                const processDoc = await processObj.findOne(_id);
                const processVersionsObj = objectql.getObject('process_versions');
                const versionDocs = await processVersionsObj.find({ filters: [['space', '=', spaceId], ['process', '=', _id]], sort: 'version desc', top: 1 }, userSession);
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
                await ctx.call(`${processDoc.engine}.save`, { process: newProcess }, { meta: { user: userSession } });
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
                if (!userSession) {
                    return;
                }
                const { spaceId } = userSession;
                const processObj = objectql.getObject('process');
                const processVersionsObj = objectql.getObject('process_versions');
                let processDoc = await processObj.findOne(_id);
                // 如果已经有版本，则查找最新流程版本，合并返回
                const versionDocs = await processVersionsObj.find({ filters: [['space', '=', spaceId], ['process', '=', _id]], sort: 'version desc', top: 1 }, userSession);
                const lastVersion = versionDocs[0];
                if (lastVersion) {
                    processDoc = {
                        ...processDoc,
                        schema: lastVersion.schema,
                        when: lastVersion.when,
                        entry_criteria: lastVersion.entry_criteria,
                        version: lastVersion.version,
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
                if (!userSession) {
                    return;
                }
                const { spaceId } = userSession;
                const processObj = objectql.getObject('process');
                const processVersionsObj = objectql.getObject('process_versions');
                const processDoc = await processObj.findOne(_id);
                const versionDocs = await processVersionsObj.find({ filters: [['space', '=', spaceId], ['process', '=', _id]], sort: 'version desc', top: 1 }, userSession);
                const lastVersion = versionDocs[0];
                // 如果没有版本，则报错
                if (_.isEmpty(versionDocs)) {
                    throw new Error('没有可发布的版本');
                }
                const newProcessDoc = {
                    ...processDoc,
                    schema: lastVersion.schema,
                    when: lastVersion.when,
                    entry_criteria: lastVersion.entry_criteria,
                    version: lastVersion.version,
                }
                await ctx.call(`${processDoc.engine}.deploy`, { process: newProcessDoc }, { meta: { user: userSession } });
                // 设置版本已发布
                await processVersionsObj.update(lastVersion._id, { is_active: true }, userSession);
                // 更新发布时间
                await processObj.directUpdate(_id, { deploy_time: new Date() });
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
                if (!userSession) {
                    return;
                }
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
                if (!userSession) {
                    return;
                }
                const processObj = objectql.getObject('process');
                const processDoc = await processObj.findOne(_id);
                await processObj.delete(_id, userSession);
                await ctx.call(`${process.engine}.delete`, { process: processDoc }, { meta: { user: userSession } });

            }
        },

        // 流程复制
        copy: {
            rest: {
                method: "POST",
                path: "/copy"
            },
            params: {
                _id: { type: 'string' }
            },
            handler: async function (ctx) {
                // call engine action
                const { _id } = ctx.params;
                const userSession = ctx.meta.user;
                if (!userSession) {
                    return;
                }
                const { spaceId, userId, company_id } = userSession;
                const processObj = objectql.getObject('process');
                const processVersionsObj = objectql.getObject('process_versions');
                const processDoc = await processObj.findOne(_id, userSession);
                const versionDocs = await processVersionsObj.find({ filters: [['space', '=', spaceId], ['process', '=', _id]], sort: 'version desc', top: 1 }, userSession);
                const latestVersion = versionDocs[0];
                const newProcessId = await processObj._makeNewID();
                const baseInfo = {
                    owner: userId,
                    created: new Date(),
                    created_by: userId,
                    modified: new Date(),
                    modified_by: userId,
                    company_id: company_id
                };
                if (latestVersion) {
                    const newVersion = {
                        ...latestVersion,
                        ...baseInfo,
                        _id: await processVersionsObj._makeNewID(),
                        process: newProcessId,
                        is_active: false,
                        version: 1
                    }
                    await processVersionsObj.insert(newVersion);
                }

                delete processDoc.version;
                delete processDoc.deploy_time;
                const newProcessDoc = {
                    ...processDoc,
                    ...baseInfo,
                    _id: newProcessId,
                    name: newProcessId,
                    label: `${processDoc.label}-副本`,
                    is_active: false,
                }
                await processObj.insert(newProcessDoc);

                return { sucess: true }
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
                record_id: { type: 'string' }
            },
            handler: async function (ctx) {
                // call process.engine.start
                const { process_id, record_id } = ctx.params;
                const userSession = ctx.meta.user;
                if (!userSession) {
                    return;
                }
                const processObj = objectql.getObject('process');
                const processDoc = await processObj.findOne(process_id);
                const recordObj = await objectql.getObject(processDoc.object_name);
                const record = await recordObj.findOne(record_id);
                await ctx.call(`${processDoc.engine}.start`, { process: processDoc, record: record }, { meta: { user: userSession } });

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