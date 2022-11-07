/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-06-11 18:09:20
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-11-05 17:41:54
 * @Description: 
 */
"use strict";
const validator = require('validator');
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 * 软件包服务启动后也需要抛出事件。
 */
module.exports = {
	name: "objectService",
	namespace: "steedos",
	/**
	 * Settings
	 */
     settings: {
		unpkg:{
			enable: validator.toBoolean(process.env.STEEDOS_UNPKG_ENABLE_LOCAL || 'false', true)
		}
	},

	/**
	 * Dependencies
	 */
	dependencies: [],

	/**
	 * Actions
	 */
	actions: {
       
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
        
       // 启动 steedos-server 服务
       this.broker.createService(require("@steedos/service-steedos-server"));
        if (this.settings.unpkg.enable) {
            this.broker.createService(require("@steedos/ee_unpkg-local"));
        }
        else{
            this.broker.createService(require("@steedos/unpkg"));
        }

        // 故障报告服务
		this.broker.createService(require("@steedos/service-sentry"));

        // 启动 报表服务
        this.broker.createService(require("@steedos/ee_stimulsoft-reports"));
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
