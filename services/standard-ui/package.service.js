/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-07-29 09:40:31
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2023-09-11 15:45:29
 * @Description: 
 */
"use strict";
const project = require('./package.json');
const packageName = project.name;
const packageLoader = require('@steedos/service-meteor-package-loader');
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
module.exports = {
	name: packageName,
	namespace: "steedos",
	mixins: [packageLoader],
	/**
	 * Settings
	 */
	settings: {
		packageInfo: {
			path: __dirname,
			name: packageName,
			isPackage: false
		}
	},

	/**
	 * Dependencies
	 */
	dependencies: ['~packages-standard-objects'],

	/**
	 * Actions
	 */
	actions: {
		getUsersName: {
			rest: {
				method: "POST",
                fullPath: "/service/api/standard-ui/getUsersName"
			},
			async handler(ctx) {
				const { userIds } = ctx.params;
				if(!userIds || userIds.length == 0){
					return []
				}
				//此查询不带权限, 使用userIds 获取用户姓名
				return await ctx.broker.call(
					'objectql.find',
					{
						objectName: 'space_users',
						query: {
							fields: ['_id', 'user', 'name', 'sort_no'],
							filters: [["user", "in", userIds]],
							sort: 'sort_no desc'
						},
					}
				);
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
};
