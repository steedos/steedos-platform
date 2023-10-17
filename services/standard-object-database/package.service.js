/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 1985-10-26 16:15:00
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-10-17 17:22:19
 * @Description: 
 */
"use strict";
const project = require('./package.json');
const packageName = project.name;
const packageLoader = require('@steedos/service-meteor-package-loader');
const serviceObjectMixin = require('@steedos/service-object-mixin');
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
module.exports = {
	name: packageName,
	namespace: "steedos",
	mixins: [packageLoader, serviceObjectMixin],
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
		object_fields__upsert: {
			graphql: {
				mutation:
				"object_fields__upsert(id: String, doc: JSON): object_fields"
			},
			async handler(ctx) {
				const userSession = ctx.meta.user;
                let { id, doc } = ctx.params;
                let data = '';
                if (_.isString(doc)) {
                    data = JSON.parse(doc);
                } else {
                    data = JSON.parse(JSON.stringify(doc));
                }
                delete data.space;
				
				const object = await this.getObject('object_fields');

				if(id.indexOf('.') > 0){
					const newId = await object._makeNewID();
					const now = new Date();
					await object.directInsert(Object.assign({}, data, {
						_id: newId,
						name: data._name,
						owner: userSession.userId,
						space: userSession.spaceId,
						created: now,
						modified: now,
						created_by: userSession.userId,
						modified_by: userSession.userId,
						company_id: userSession.company_id,
						company_ids: userSession.company_ids
					}));					
					id = newId;
				}
                return object.update(id, data, userSession)
			},
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
};
