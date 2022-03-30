/*
 * @Author: sunhaolin@hotoa.com 
 * @Date: 2022-03-25 14:17:36 
 * @Last Modified by: sunhaolin@hotoa.com
 * @Last Modified time: 2022-03-27 19:12:37
 */

"use strict";
// @ts-check

const serviceName = 'cmb-bpm';

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
module.exports = {
    name: serviceName,
    namespace: "steedos",
    mixins: [],
    /**
     * Settings
     */
    settings: {
        packageInfo: {
            path: __dirname,
            name: serviceName
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
        
        save: {
            params: {
                process: {
                    type: 'object',
                },
                operator: {
                    type: 'object'
                }
            },
            handler: async function (ctx) {
                // call cmb-bpm api
                console.log('save: ');
                const { process, operator } = ctx.params;
                
            }
        },

        // 流程发布
        deploy: {
            params: {},
            handler: async function (ctx) {
                // call cmb-bpm api
                console.log('deploy: ');

            }
        },

        // 启用
        enable: {
            params: {
                process: {
                    type: 'object',
                },
                operator: {
                    type: 'object'
                }
            },
            handler: async function (ctx) {
                // call cmb-bpm api
                console.log('enable: ')
                const { process, operator } = ctx.params;
                
            }
        },

        // 禁用
        disable: {
            params: {
                process: {
                    type: 'object',
                },
                operator: {
                    type: 'object'
                }
            },
            handler: async function (ctx) {
                // call cmb-bpm api
                console.log('disable: ')
                const { process, operator } = ctx.params;
                
            }
        },


        // 申请单发起
        start: {
            params: {},
            handler: async function (ctx) {
                // call process.engine.start
                console.log('start: ')
                
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