/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */
"use strict";
const _ = require("lodash");
const register = require("@steedos/metadata-registrar");
const { ActionFieldUpdateCacher, WorkflowOutboundMessageCacher, WorkflowNotificationCacher, WorkflowRuleCacher, ObjectValidationRulesCacher, SettingsCacher, ObjectWebhookCacher
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
    "$packages.changed": function () {
      this.loadMetadataWorkflows();
      this.loadMetadataValidationRule();
      this.loadMetadataObjectFunctions();
    },
    "$metadata.*": function (payload, sender, event, ctx) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const self = this;
      // console.log(`Event '${event}' received from ${sender} node:`, payload);
      const { type, action, data } = payload;
      switch (type) {
        case "action_field_updates":
          self.actionFieldUpdatesCacher.handleAction(action, {
            name: data.object_name,
          });
          break;
        case "object_functions":
          self.objectFunctionsCacher.handleAction(action, {
            name: data.object,
          });
          break;
        case "object_validation_rules":
          self.objectValidationRulesCacher.handleAction(action, {
            name: data.object,
          });
          break;
        case "object_webhooks":
          self.objectWebhooksCacher.handleAction(action, data);
          break;
        case "settings":
          self.settingsCacher.handleAction(action, data);
          break;
        case "workflow_notifications":
          self.workflowNotificationsCacher.handleAction(action, data);
          break;
		case "workflow_outbound_messages":
			self.workflowOutboundMessagesCacher.handleAction(action, data);
			break;
		case "workflow_rule":
			self.workflowRuleCacher.handleAction(action, data);
			break;
        default:
          break;
      }
    },
  },

  actions: {
    find: function (ctx) {
      const { metadataName, filters, spaceId } = ctx.params;
      const res = this[`${_.camelCase(metadataName)}Cacher`]?.find(
        filters,
        spaceId
      );
      return res || [];
    },
    get: function (ctx) {
      const { _id, metadataName } = ctx.params;
      return this[`${_.camelCase(metadataName)}Cacher`]?.get(_id);
    },
  },

  methods: {
    loadMetadataWorkflows: async function () {
      // eslint-disable-next-line no-undef
      const res = await broker.call(`workflow.getAll`);
      _.each(res, (wf) => {
        _.each(wf.metadata.rules, (item) => {
          this.workflowRuleCacher.set(item._id || item.name, item);
        });

        _.each(wf.metadata.fieldUpdates, (item) => {
          this.actionFieldUpdatesCacher.set(item._id || item.name, item);
        });

        _.each(wf.metadata.notifications, (item) => {
          this.workflowNotificationsCacher.set(item._id || item.name, item);
        });

        _.each(wf.metadata.outboundMessages, (item) => {
          this.workflowOutboundMessagesCacher.set(item._id || item.name, item);
        });
      });
    },
    loadMetadataValidationRule: async function () {
      let res = await register.getAllObjectValidationRules();
      _.each(res, (item) => {
        this.objectValidationRulesCacher.set(item._id, item);
      });
    },
    loadMetadataObjectFunctions: async function () {
      // eslint-disable-next-line no-undef
      const res = await broker.call(`object_functions.getAll`);
      _.each(res, (item) => {
        const metadata = item.metadata;
        const idKey = `${metadata.objectApiName}__${metadata.name}`;
        // 缓存里没有的才加
        const doc = this.objectFunctionsCacher.get(idKey);
        if (!doc) {
          this.objectFunctionsCacher.set(idKey, metadata);
        }
      });
    },
  },

  async started() {
    this.actionFieldUpdatesCacher = new ActionFieldUpdateCacher();

    await this.actionFieldUpdatesCacher.init();

    this.workflowOutboundMessagesCacher = new WorkflowOutboundMessageCacher();

    await this.workflowOutboundMessagesCacher.init();

    this.workflowNotificationsCacher = new WorkflowNotificationCacher();

    await this.workflowNotificationsCacher.init();

    this.workflowRuleCacher = new WorkflowRuleCacher();

    await this.workflowRuleCacher.init();

    this.objectValidationRulesCacher = new ObjectValidationRulesCacher();

    await this.objectValidationRulesCacher.init();

    this.settingsCacher = new SettingsCacher();

    await this.settingsCacher.init();

    this.objectWebhooksCacher = new ObjectWebhookCacher();

    await this.objectWebhooksCacher.init();

    this.objectFunctionsCacher = new ObjectFunctionsCacher();

    await this.objectFunctionsCacher.init();

    await this.loadMetadataWorkflows();
  },

  async stopped() {
    this.actionFieldUpdatesCacher?.destroy();
    this.workflowOutboundMessagesCacher?.destroy();
    this.workflowNotificationsCacher?.destroy();
    this.workflowRuleCacher?.destroy();
    this.objectValidationRulesCacher?.destroy();
    this.settingsCacher?.destroy();
    this.objectWebhooksCacher?.destroy();
    this.objectFunctionsCacher?.destroy();
  },
};
