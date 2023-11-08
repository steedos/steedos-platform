/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 1985-10-26 16:15:00
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-11-04 16:05:25
 * @Description: 
 */
"use strict";
const project = require('./package.json');
const packageName = project.name;
const packageLoader = require('@steedos/service-meteor-package-loader');
const serviceObjectMixin = require('@steedos/service-object-mixin');

const triggers = require('./src/triggers');

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
		...triggers,

		objects__upsert: {
			graphql: {
				mutation:
				"objects__upsert(id: String, doc: JSON): objects"
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

				if(data.form && _.isString(data.form)){
					data.form = JSON.parse(data.form)
				}

                delete data.space;

				if(data.is_system){
					data = _.pick(data, ['label', 'icon', 'enable_files', 'enable_tasks', 'enable_notes', 'enable_events', 'enable_workflow', 'enable_instances', 'enable_inline_edit', 'enable_tree', 'enable_enhanced_lookup', 'description', 'is_deleted'])
				}
				
				const object = await this.getObject('objects');
				const dbRecord = await object.directFind({filters: ['_id','=',id]});
				if(dbRecord.length === 0){
					// const newId = await object._makeNewID();
					const now = new Date();
					await object.directInsert(Object.assign({}, data, {
						// _id: newId,
						_id: id, // saas模式不支持修改对象
						owner: userSession.userId,
						space: userSession.spaceId,
						created: now,
						modified: now,
						created_by: userSession.userId,
						modified_by: userSession.userId,
						company_id: userSession.company_id,
						company_ids: userSession.company_ids,
						extend: data.name,
						custom: false,
						is_system: true
					}));					
					// id = newId;
				}
                return object.update(id, data, userSession)
			},
		},
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

				if(data.is_system){
					data = _.pick(data, ['label', 'defaultValue', 'group', 'rows', 'sort_no', 'is_wide', 'index', 'sortable', 'searchable', 'filterable', 'visible_on', 'inlineHelpText', 'description', 'amis'])
				}
				
				const object = await this.getObject('object_fields');
				if(id.indexOf('.') > 0){
					const [objectName, fieldName] = id.split('.');
					const dbRecord = await object.directFind({filters: [['object','=',objectName], ['name','=',fieldName]]});
					if(dbRecord.length > 0){
						id = dbRecord[0]._id;
					}else{
						const newId = await object._makeNewID();
						const now = new Date();
						await object.directInsert(Object.assign({}, data, {
							_id: newId,
							name: data._name || fieldName,
							owner: userSession.userId,
							space: userSession.spaceId,
							object: objectName,
							created: now,
							modified: now,
							created_by: userSession.userId,
							modified_by: userSession.userId,
							company_id: userSession.company_id,
							company_ids: userSession.company_ids,
							is_system: true
						}));					
						id = newId;
					}
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
