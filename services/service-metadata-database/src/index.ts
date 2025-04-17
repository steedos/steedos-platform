/* eslint-disable @typescript-eslint/no-unused-vars */
/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-03-04 17:02:52
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2025-03-12 15:11:33
 * @Description:
 */
"use strict";
// import * as actions from './actions';
// import * as methods from './methods';
import { ObjectsHandle, AppsHandle, TabsHandle } from "./handles";

const project = require("../package.json");
const packageName = project.name;

module.exports = {
  name: packageName,
  namespace: "steedos",
  mixins: [],

  /**
   * Dependencies
   */
  dependencies: ["@steedos/service-core-objects"],

  /**
   * Actions
   */
  actions: {
    // ...actions
  },

  /**
   * Events
   */
  events: {
    "$metadata.*": function (payload, sender, event, ctx) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const self = this;
      // console.log(`Event '${event}' received from ${sender} node:`, payload);
      const { type, action, data } = payload;
      switch (type) {
        case "apps":
          self.appsHandle.handleAction(action, data);
          break;
        case "tabs":
          self.tabsHandle.handleAction(action, data);
          break;
        case "object_listviews":
          self.objectsHandle.handleAction(action, { name: data.object_name });
          break;
        case "object_fields":
          self.objectsHandle.handleAction(action, { name: data.object });
          break;
        case "object_actions":
          self.objectsHandle.handleAction(action, { name: data.object });
          break;
        case "objects":
          self.objectsHandle.handleAction(action, data);
          break;
        default:
          break;
      }
    },
  },

  /**
   * Methods
   */
  methods: {
    // ...methods
  },

  /**
   * Service created lifecycle event handler
   */
  async created() {
    this.objectsHandle = new ObjectsHandle();
    this.appsHandle = new AppsHandle();
    this.tabsHandle = new TabsHandle();
  },

  /**
   * Service started lifecycle event handler
   */
  async started() {
    console.log(`Service ${packageName} started`);
    await this.appsHandle.init();
    await this.tabs;
    await this.objectsHandle.init();
  },

  /**
   * Service stopped lifecycle event handler
   */
  async stopped() {},
};
