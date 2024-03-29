/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2024-03-22 14:37:50
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-03-29 14:52:13
 * @Description: 由于 collection observe 在 steedos-server.started 事件中被触发报错需要 Fiber ,添加Fiber 后, 不报错,但是无法订阅到数据. 所以单写服务处理此问题.
 * 
 */

"use strict";
const _ = require('lodash')
const register = require('@steedos/metadata-registrar');
const { ActionFieldUpdateCacher, WorkflowOutboundMessageCacher, WorkflowNotificationCacher, WorkflowRuleCacher, ObjectValidationRulesCacher } = require('./lib/index')
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 * 软件包服务启动后也需要抛出事件。
 */
module.exports = {
	name: "metadata-cachers-service",
	namespace: "steedos",
	/**
	 * Dependencies
	 */
	dependencies: ['steedos-server'],

	events: {
		'$packages.changed': function(){
			this.loadMetadataWorkflows();
			this.loadMetadataValidationRule()
		}
	},

	actions:{
		find: function(ctx){
			const { metadataName, filters, spaceId } = ctx.params;
			const res = this[`${_.camelCase(metadataName)}Cacher`].find(filters, spaceId);
			return res;
		},
		get: function(ctx){
			const { _id } = ctx.params;
			return this[`${_.camelCase(metadataName)}Cacher`].get(_id)
		}
	},

	methods: {
		loadMetadataWorkflows: async function(){
			const res = await broker.call(`workflow.getAll`);
			_.each(res, (wf)=>{
				_.each(wf.metadata.rules, (item)=>{
					this.workflowRuleCacher.set(item._id || item.name, item)
				});
	
				_.each(wf.metadata.fieldUpdates, (item)=>{
					this.actionFieldUpdatesCacher.set(item._id || item.name, item)
				});
	
				_.each(wf.metadata.notifications, (item)=>{
					this.workflowNotificationsCacher.set(item._id || item.name, item)
				});
	
				_.each(wf.metadata.outboundMessages, (item)=>{
					this.workflowOutboundMessagesCacher.set(item._id || item.name, item)
				});
			})
		},
		loadMetadataValidationRule: async function(){
			let res = await register.getAllObjectValidationRules();
			_.each(res, (item)=>{
				this.objectValidationRulesCacher.set(item._id, item)
			})
		}
	},

	async started() {
		this.actionFieldUpdatesCacher = new ActionFieldUpdateCacher()

        this.workflowOutboundMessagesCacher = new WorkflowOutboundMessageCacher();

        this.workflowNotificationsCacher = new WorkflowNotificationCacher();

        this.workflowRuleCacher = new WorkflowRuleCacher();

		this.objectValidationRulesCacher = new ObjectValidationRulesCacher()

		await this.loadMetadataWorkflows()
	},

	async stopped(){
		this.actionFieldUpdatesCacher?.destroy();
		this.workflowOutboundMessagesCacher?.destroy();
		this.workflowNotificationsCacher?.destroy();
		this.workflowRuleCacher?.destroy();
		this.objectValidationRulesCacher?.destroy();
	}
};
