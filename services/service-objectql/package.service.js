/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2023-03-23 15:12:14
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2023-03-27 14:47:35
 * @Description: 
 */

"use strict";
const { getObject } = require('@steedos/objectql');

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
module.exports = {
    name: 'objectql',
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

        find: {
            params: {
                objectName: { type: "string" },
                query: {
                    type: "object",
                    // fields: { type: 'array', items: "string", optional: true },
                    // filters: [{ type: 'array', optional: true }, { type: 'string', optional: true }],
                    // top: { type: 'number', optional: true },
                    // skip: { type: 'number', optional: true },
                    // sort: { type: 'string', optional: true }
                },
            },
            async handler(ctx) {
                this.broker.logger.warn('objectql.find', ctx.params)
                const { objectName, query } = ctx.params
                const obj = await getObject(objectName)
                const userSession = ctx.meta.user;
                return await obj.find(query, userSession)
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
    created() {
    },

    merged(schema) {
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
};
