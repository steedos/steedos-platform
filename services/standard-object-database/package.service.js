/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 1985-10-26 16:15:00
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-10-10 15:58:37
 * @Description: 
 */
"use strict";
const project = require('./package.json');
const packageName = project.name;
const packageLoader = require('@steedos/service-meteor-package-loader');
const serviceObjectMixin = require('@steedos/service-object-mixin');
const validator = require('validator');
const triggers = require('./src/triggers');
const { checkAPIName } = require('@steedos/standard-objects').util

const { customAlphabet } = require('nanoid');
const { group } = require('console');
const nanoid = customAlphabet('1234567890abcdef', 10)

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
				if(validator.toBoolean(process.env.STEEDOS_TENANT_ENABLE_SAAS || 'false', true) == true){
					throw new Error('No permission')
				}
				const userSession = ctx.meta.user;
                let { id, doc } = ctx.params;
                return this.objectsUpsert(id, doc, userSession)
			},
		},
		object_fields__upsert: {
			graphql: {
				mutation:
				"object_fields__upsert(id: String, doc: JSON): object_fields"
			},
			async handler(ctx) {
				if(validator.toBoolean(process.env.STEEDOS_TENANT_ENABLE_SAAS || 'false', true) == true){
					throw new Error('No permission')
				}
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
					const [objectName, fieldName] = id.split('.');

					const dbObj = await this.getObject('objects').directFind({filters: ['name','=', objectName]});

					if(dbObj.length === 0){
						const records = await this.getObject('objects').find({filters: ['name','=', objectName]});
						if(records.length > 0){
							this.objectsUpsert(objectName, records[0], userSession)
						}
					}

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
				if(data.is_system){
					data = _.pick(data, ['label', 'defaultValue', 'group', 'rows', 'sort_no', 'is_wide', 'index', 'sortable', 'searchable', 'filterable', 'visible_on', 'inlineHelpText', 'description', 'amis', 'required', 'unique', 'readonly', 'hidden', 'deleted_lookup_record_behavior', 'enable_thousands', 'autonumber_enable_modify', 'auto_fill_mapping']);
				}
                return object.update(id, data, userSession)
			},
		},
		checkAPIName: {
			params: {
				objectName: { type: 'string' },
				fieldName: { type: 'string' },
				fieldValue: { type: 'string' },
				recordId: { type: 'string', optional: true },
				filters: { type: 'array', optional: true, },
			},
			async handler (ctx) {
				const { objectName, fieldName, fieldValue, recordId, filters } = ctx.params;
				await checkAPIName(objectName, fieldName, fieldValue, recordId, filters)
			}
		},
		create_object: {
			rest: {
				method: "POST",
                fullPath: "/service/api/objects/create_by_design"
			},
			async handler(ctx) {
				const { appId, groupId, name, label, icon } = ctx.params;
				const userSession = ctx.meta.user;

				if(!appId){
					return;
				}

				const records = await this.getObject('apps').find({
					filters: ['code', '=', appId]
				});
				const app = records.length > 0 ? records[0] : null;

				if(!app){
					return ;
				}

				// 1 创建对象
				const obj = await this.getObject('objects').insert({
					name: name || `o_${nanoid(5)}`,
					label: label || '未命名对象',
					datasource: 'default',
					icon: icon || 'account'
				}, userSession);
				
				
				const tab_items = app.tab_items || {};
				tab_items[`object_${obj.name.replace(/__c$/, "")}`] = {
					group: groupId
				}

				await this.getObject('apps').update(app._id, {
					tab_items
				}, userSession);
				
				return obj;
			}
		},
		create_app_group: {
			rest: {
				method: "POST",
                fullPath: "/service/api/apps/create_app_group_by_design"
			},
			async handler(ctx) {
				const { appId, name, defaultOpen, oldName } = ctx.params;
				const userSession = ctx.meta.user;

				if(!appId){
					return {};
				}

				const records = await this.getObject('apps').find({
					filters: ['code', '=', appId]
				});
				const app = records.length > 0 ? records[0] : null;

				if(!app){
					return {};
				}

				await this.getObject('apps').update(app._id, {
					$push: {
						tab_groups: {
							group_name: name,
							default_open: defaultOpen
						}
					}
				}, userSession);
				
				return {};
			}
		},
		update_app_group: {
			rest: {
				method: "POST",
                fullPath: "/service/api/apps/update_app_group_by_design"
			},
			async handler(ctx) {
				const { appId, name, defaultOpen, oldName } = ctx.params;
				const userSession = ctx.meta.user;

				if(!oldName){
					return {}
				}

				if(!appId){
					return {};
				}

				const records = await this.getObject('apps').find({
					filters: ['code', '=', appId]
				});
				const app = records.length > 0 ? records[0] : null;

				if(!app){
					return {};
				};

				const tab_groups = app.tab_groups;

				const tab_items = app.tab_items;

				_.each(tab_groups, (tGroup)=>{
					if(tGroup.group_name == oldName){
						tGroup.group_name = name;
						tGroup.default_open = defaultOpen
					}
				});


				_.each(tab_items, (tItem, key)=>{
					if(tItem.group === oldName){
						tab_items[key] = {
							group: name
						}
					}
				})

				await this.getObject('apps').update(app._id, {
					tab_groups, tab_items
				}, userSession);
				
				return {};
			}
		},
		create_by_design: {
			rest: {
				method: "POST",
                fullPath: "/service/api/apps/create_by_design"
			},
			async handler(ctx) {
				const { code, name, icon } = ctx.params;
				const userSession = ctx.meta.user;

				if(!code || !name){
					return {};
				}

				return await this.getObject('apps').insert({
					name: name,
					code: code,
					sort : 9100,
					is_creator : true,
					mobile : true,
					visible : true,
					showSidebar : true,
					icon_slds : icon || "account",
				}, userSession);
			}
		},
		update_app_by_design: {
			rest: {
				method: "POST",
                fullPath: "/service/api/apps/update_app_by_design"
			},
			async handler(ctx) {
				const { appId, tab_groups, tab_items } = ctx.params;
				const userSession = ctx.meta.user;

				if(!appId){
					return {};
				}

				const records = await this.getObject('apps').find({
					filters: ['code', '=', appId]
				});
				const app = records.length > 0 ? records[0] : null;

				if(!app){
					return {};
				}

				await this.getObject('apps').update(app._id, {
					tab_groups: tab_groups,
					tab_items: tab_items
				}, userSession);
				
			}
		},
		update_app_tabs_by_design: {
			rest: {
				method: "POST",
                fullPath: "/service/api/apps/update_app_tabs_by_design"
			},
			async handler(ctx) {
				const { appId, addTabNames, groupId } = ctx.params;
				const userSession = ctx.meta.user;

				if(!appId){
					return {};
				}

				const records = await this.getObject('apps').find({
					filters: ['code', '=', appId]
				});
				const app = records.length > 0 ? records[0] : null;

				if(!app){
					return {};
				}

				const tab_items = app.tab_items || {};

				_.each(addTabNames, (tabName)=>{
					if(tabName){
						tab_items[tabName] = {
							group: groupId
						}
					}
				})

				await this.getObject('apps').update(app._id, {
					tab_items
				}, userSession);
				
			}
		},
		create_link_tab_by_design: {
			rest: {
				method: "POST",
                fullPath: "/service/api/tabs/create_link_tab_by_design"
			},
			async handler(ctx) {
				const { appId, groupId, name, label, icon, url } = ctx.params;
				const userSession = ctx.meta.user;

				if(!appId){
					return;
				}

				const records = await this.getObject('apps').find({
					filters: ['code', '=', appId]
				});
				const app = records.length > 0 ? records[0] : null;

				if(!app){
					return ;
				}

				const tab = await this.getObject('tabs').insert({
					name: name || `t_${nanoid(5)}`,
					label: label || '未命名选项卡',
					icon: icon || 'account',
					mobile : true,
					desktop : true,
					is_new_window : false,
					is_use_iframe : true,
					type : "url",
					url : url,
				}, userSession);
				
				
				const tab_items = app.tab_items || {};
				tab_items[tab.name] = {
					group: groupId
				}
				await this.getObject('apps').update(app._id, {
					tab_items
				}, userSession);
				
				return tab;
			}
		},
		update_link_tab_by_design: {
			rest: {
				method: "POST",
                fullPath: "/service/api/tabs/update_link_tab_by_design"
			},
			async handler(ctx) {
				const { appId, groupId, name, label, icon, url } = ctx.params;
				const userSession = ctx.meta.user;

				if(!appId){
					return;
				}

				const records = await this.getObject('apps').find({
					filters: ['code', '=', appId]
				});
				const app = records.length > 0 ? records[0] : null;

				if(!app){
					return ;
				}

				const dbTab = await this.getObject('tabs').find({
					filters: ['name', '=', name]
				}, userSession);

				if(dbTab.length > 0){
					const tab = await this.getObject('tabs').update(dbTab[0]._id, {
						name: name,
						label: label,
						icon: icon,
						url : url,
					}, userSession);
					return tab;
				}
				return dbTab;
			}
		},
		create_page_by_design: {
			rest: {
				method: "POST",
                fullPath: "/service/api/pages/create_page_by_design"
			},
			async handler(ctx) {
				const { appId, groupId, name, label, icon } = ctx.params;
				const userSession = ctx.meta.user;

				if(!appId){
					return;
				}

				const records = await this.getObject('apps').find({
					filters: ['code', '=', appId]
				});
				const app = records.length > 0 ? records[0] : null;

				if(!app){
					return ;
				}

				const page = await this.getObject('pages').insert({
					name: name || `t_${nanoid(5)}`,
					label : label,
					is_active : true,
					render_engine : "amis",
					type : "app"
				}, userSession);
				
				const tab = await this.getObject('tabs').insert({
					name: `page_${page.name}`,
					mobile : true,
					desktop : true,
					is_new_window : false,
					is_use_iframe : false,
					icon : icon,
					type : "page",
					label : label,
					page : page.name,
				}, userSession);
				
				
				const tab_items = app.tab_items || {};
				tab_items[tab.name] = {
					group: groupId
				}
				await this.getObject('apps').update(app._id, {
					tab_items
				}, userSession);
				
				return page;
			}
		},
		delete_app_tab: {
			rest: {
				method: "POST",
                fullPath: "/service/api/apps/delete_app_tab"
			},
			async handler(ctx) {
				const { appId, tabName } = ctx.params;
				const userSession = ctx.meta.user;

				if(!appId){
					return;
				}

				const records = await this.getObject('apps').find({
					filters: ['code', '=', appId]
				});
				const app = records.length > 0 ? records[0] : null;

				if(!app){
					return ;
				}
				
				
				const tab_items = app.tab_items || {};

				delete tab_items[tabName]

				await this.getObject('apps').update(app._id, {
					tab_items
				}, userSession);
				
				return app;
			}
		},
		delete_app_group: {
			rest: {
				method: "POST",
                fullPath: "/service/api/apps/delete_app_group"
			},
			async handler(ctx) {
				const { appId, groupName } = ctx.params;
				const userSession = ctx.meta.user;

				if(!appId){
					return;
				}

				const records = await this.getObject('apps').find({
					filters: ['code', '=', appId]
				});
				const app = records.length > 0 ? records[0] : null;

				if(!app){
					return ;
				}
				
				const tab_groups = app.tab_groups || [];
				const newTabGroups = [];
				
				_.each(tab_groups, (tGroup)=>{
					if(tGroup.group_name != groupName){
						newTabGroups.push(tGroup);
					}
				});
				await this.getObject('apps').update(app._id, {
					tab_groups: newTabGroups
				}, userSession);
				
				return app;
			}
		},
		move_app_tab: {
			rest: {
				method: "POST",
                fullPath: "/service/api/apps/move_app_tab"
			},
			async handler(ctx) {
				const { appId, tabName, groupName, oldGroupName } = ctx.params;
				const userSession = ctx.meta.user;

				if(!appId){
					return;
				}

				const records = await this.getObject('apps').find({
					filters: ['code', '=', appId]
				});
				const app = records.length > 0 ? records[0] : null;

				if(!app){
					return ;
				}
				
				
				const tab_items = app.tab_items || {};

				_.each(tab_items, (item, k)=>{
					if(k === tabName){
						tab_items[k].group = groupName == 0 ? '' : groupName
					}
				})

				await this.getObject('apps').update(app._id, {
					tab_items
				}, userSession);
				
				return app;
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
		objectsUpsert: {
			async handler(id, doc, userSession){
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
				const name = data.name;
				
				const object = await this.getObject('objects');
				const dbRecord = await object.directFind({filters: ['_id','=',id]});
				if(dbRecord.length === 0){
					// const newId = await object._makeNewID();
					const curentObject = await this.getObject(name);
					const curentObjectConfig = await curentObject.toConfig();
					let field_groups = curentObjectConfig.field_groups || null;
					
					const now = new Date();
					await object.directInsert(Object.assign({}, data, {
						// _id: newId,
						_id: id, // saas模式不支持修改对象
						name: name,
						owner: userSession.userId,
						space: userSession.spaceId,
						created: now,
						modified: now,
						created_by: userSession.userId,
						modified_by: userSession.userId,
						company_id: userSession.company_id,
						company_ids: userSession.company_ids,
						extend: name,
						custom: false,
						is_system: true,
						field_groups: field_groups
					}));					
					// id = newId;
				}

				if(data.is_system){
					data = _.pick(data, ['label', 'icon', 'enable_files', 'enable_tasks', 'enable_notes', 'enable_events', 'enable_workflow', 'enable_instances', 'enable_inline_edit', 'enable_tree', 'enable_enhanced_lookup', 'description', 'is_deleted', 'field_groups'])
				}

                return object.update(id, data, userSession)
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

	}
};
