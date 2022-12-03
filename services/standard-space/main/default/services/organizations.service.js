/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-12-02 16:53:23
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-12-03 17:21:06
 * @Description: 
 */
"use strict";
const { getObject } = require("@steedos/objectql")
const _ = require("lodash");
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
			async handler(ctx) {
				this.broker.logger.warn('[service][organizations]===>', 'calculateFullname')
				return this.calculateFullname(ctx.params.orgId)
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
			const parentId = orgDoc.parent;
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
		this.broker.logger.warn('[service]===> spaces started')
	},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {

	}
};
