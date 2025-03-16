/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */
"use strict";
const _ = require('lodash')
const register = require('@steedos/metadata-registrar');
const { ObjectValidationRulesCacher, SettingsCacher, ObjectWebhookCacher
	, ObjectFunctionsCacher
 } = require('./lib/index')
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 * 软件包服务启动后也需要抛出事件。
 */
// eslint-disable-next-line no-undef
module.exports = {
	name: "metadata-cachers-service",
	namespace: "steedos",
	/**
	 * Dependencies
	 */
	dependencies: [],

	events: {
		'@steedos/server.started': function(){
			// this.loadMetadataWorkflows();
			this.loadMetadataValidationRule();
			this.loadMetadataObjectFunctions();
		}
	},

	actions:{
		find: function(ctx){
			const { metadataName, filters, spaceId } = ctx.params;
			const res = this[`${_.camelCase(metadataName)}Cacher`]?.find(filters, spaceId);
			return res || [];
		},
		get: function(ctx){
			const { _id, metadataName } = ctx.params;
			return this[`${_.camelCase(metadataName)}Cacher`]?.get(_id)
		}
	},

	methods: {
		loadMetadataWorkflows: async function(){
			// eslint-disable-next-line no-undef
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
		},
		loadMetadataObjectFunctions: async function(){
			// eslint-disable-next-line no-undef
			const res = await broker.call(`object_functions.getAll`);
			_.each(res, (item)=>{
				const metadata = item.metadata;
				const idKey = `${metadata.objectApiName}__${metadata.name}`
				// 缓存里没有的才加
				const doc = this.objectFunctionsCacher.get(idKey)
				if (!doc) {
					this.objectFunctionsCacher.set(idKey, metadata)
				}
			})
		},
	},

	async started() {
		// this.actionFieldUpdatesCacher = new ActionFieldUpdateCacher()

        // this.workflowOutboundMessagesCacher = new WorkflowOutboundMessageCacher();

        // this.workflowNotificationsCacher = new WorkflowNotificationCacher();

        // this.workflowRuleCacher = new WorkflowRuleCacher();

		this.objectValidationRulesCacher = new ObjectValidationRulesCacher()

		this.settingsCacher = new SettingsCacher();

		this.objectWebhooksCacher = new ObjectWebhookCacher();

		this.objectFunctionsCacher = new ObjectFunctionsCacher();

		// await this.loadMetadataWorkflows()
	},

	async stopped(){
		// this.actionFieldUpdatesCacher?.destroy();
		// this.workflowOutboundMessagesCacher?.destroy();
		// this.workflowNotificationsCacher?.destroy();
		// this.workflowRuleCacher?.destroy();
		this.objectValidationRulesCacher?.destroy();
		this.settingsCacher?.destroy();
		this.objectWebhooksCacher?.destroy();
		this.objectFunctionsCacher?.destroy();
	}
};
