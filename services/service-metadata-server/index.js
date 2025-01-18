/*
 * @Author: baozhoutao@hotoa.com
 * @Date: 2022-03-28 14:16:03
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2025-01-17 10:56:40
 * @Description: 
 */

const metadata = require('@steedos/service-metadata');
const packages = require('@steedos/service-packages');
const apps = require('@steedos/service-metadata-apps');
const objects = require('@steedos/service-metadata-objects');
const layouts = require('@steedos/service-metadata-layouts');
const permissionsets = require('@steedos/service-metadata-permissionsets');
const tabs = require('@steedos/service-metadata-tabs');
const translations = require('@steedos/service-metadata-translations');
const triggers = require('@steedos/service-metadata-triggers');

const queriesService = require('./lib/queriesService');
const chartsService = require('./lib/chartsService');
const pagesService = require('./lib/pagesService');
const shareRulesService = require('./lib/shareRulesService');
const restrictionRulesService = require('./lib/restrictionRulesService');
const permissionFieldsService = require('./lib/permissionFieldsService');
const processService = require('./lib/processService');
const processTriggerService = require('./lib/processTriggerService');
const objectTriggerService = require('./lib/objectTriggerService');
const permissionTabsService = require('./lib/permissionTabsService');
const importService = require('./lib/importService');
const clientJSService = require('./lib/clientJSService');
const questionService = require('./lib/questionService')
const dashboardService = require('./lib/dashboardService')
const printService = require('./lib/printService')
const objectFunctionService = require('./lib/objectFunctionService')

const approvalProcessService = require('./lib/approvalProcessService')
const flowRoleService = require('./lib/flowRoleService')
const roleService = require('./lib/roleService')
const validationRuleService = require('./lib/validationRuleService');
const workflowService = require('./lib/workflowService');

module.exports = {
	name: "metadata-server",

  /**
   * Service created lifecycle event handler
   */
  async created() {
    console.log(`metadata-server created.....`)
    this.broker.createService(metadata);
    console.log('metadata service created');
    this.broker.createService(packages);
    console.log('packages service created');
    this.broker.createService(apps);
    console.log('apps service created');
    this.broker.createService(objects);
    console.log('objects service created');
    this.broker.createService(layouts);
    console.log('layouts service created');
    this.broker.createService(permissionsets);
    console.log('permissionsets service created');
    this.broker.createService(tabs);
    console.log('tabs service created');
    this.broker.createService(translations);
    console.log('translations service created');
    this.broker.createService(triggers);
    console.log('triggers service created');
    this.broker.createService(queriesService);
    console.log('queriesService created');
    this.broker.createService(chartsService);
    console.log('chartsService created');
    this.broker.createService(pagesService);
    console.log('pagesService created');
    this.broker.createService(shareRulesService);
    console.log('shareRulesService created');
    this.broker.createService(restrictionRulesService);
    console.log('restrictionRulesService created');
    this.broker.createService(permissionFieldsService);
    console.log('permissionFieldsService created');
    this.broker.createService(processService);
    console.log('processService created');
    this.broker.createService(processTriggerService);
    console.log('processTriggerService created');
    this.broker.createService(objectTriggerService);
    console.log('objectTriggerService created');
    this.broker.createService(permissionTabsService);
    console.log('permissionTabsService created');
    this.broker.createService(importService);
    console.log('importService created');
    this.broker.createService(clientJSService);
    console.log('clientJSService created');
    this.broker.createService(questionService);
    console.log('questionService created');
    this.broker.createService(dashboardService);
    console.log('dashboardService created');
    this.broker.createService(printService);
    console.log('printService created');
    this.broker.createService(objectFunctionService);
    console.log('objectFunctionService created');

    this.broker.createService(approvalProcessService);
    console.log('approvalProcessService created');
    this.broker.createService(flowRoleService);
    console.log('flowRoleService created');
    this.broker.createService(roleService);
    console.log('roleService created');
    this.broker.createService(validationRuleService);
    console.log('validationRuleService created');
    this.broker.createService(workflowService);
    console.log('workflowService created');
  },

  async started() {
    await this.broker.waitForServices(['metadata', 'apps', 'objects', 'permissionsets', 'translations', 'triggers'], null, 10);
    console.log(`metadata-server started.....`)
  }
}