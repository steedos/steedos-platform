/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-04-22 12:07:05
 * @Description: 
 */
const objectql = require('@steedos/objectql');

const _ = require('lodash');

module.exports = {
    name: "pkg1",
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
        
        //发布最新版
        test: {
            rest: {
                method: "GET",
                path: "/test"
            },
            handler: async function (ctx) {
                console.log("test======6666======");
            }
        }
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
        console.log("pkg stop====222===========>");
    }
};
