/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 1985-10-26 16:15:00
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2025-01-16 21:18:27
 * @Description: 
 */
"use strict";

const { customAlphabet } = require('nanoid');
const nanoid = customAlphabet('1234567890abcdef', 10)
const objectMixin = require('@steedos/service-object-mixin')
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
module.exports = {
	name: 'app-design',
	namespace: "steedos",
	mixins: [objectMixin],
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
