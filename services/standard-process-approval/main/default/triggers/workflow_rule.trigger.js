/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2021-08-30 12:06:41
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-03-13 14:57:01
 * @Description: 
 */
const _ = require("underscore");
const util = require('@steedos/standard-objects').util;
const objectql = require("@steedos/objectql");
const register = require("@steedos/metadata-registrar")
const InternalData = require('@steedos/standard-objects').internalData;

const getInternalWorkflowRules = function(sourceWorkflowRules, filters, dbWorkflowRules){
    let workflowRules = [];

    if(!filters.is_system){
        _.forEach(sourceWorkflowRules, function(doc){
            if(!_.find(dbWorkflowRules, function(p){
                return p.name === doc.name
            })){
                workflowRules.push(doc);
            }
        })
    }
    return workflowRules;
}

module.exports = {
    beforeInsert: async function () {
        await util.checkAPIName(this.object_name, 'name', this.doc.name, undefined, [['is_system','!=', true]]);

    },
    beforeUpdate: async function () {
        if (_.has(this.doc, 'name')) {
            await util.checkAPIName(this.object_name, 'name', this.doc.name, this.id, [['is_system','!=', true]]);
        }
    },
    afterFind: async function(){
        let filters = InternalData.parserFilters(this.query.filters)
        let workflowRules = [];

        let fObjectName = filters.object_name;

        if(fObjectName){
            delete filters.object_name;
        }

        let dbWorkflowRules = Creator.getCollection("workflow_rule").find(filters, {fields:{_id:1, name:1}}).fetch()

        if(fObjectName){
            workflowRules = await register.getObjectWorkflowRules(fObjectName);
        }else{
            workflowRules = await register.getAllWorkflowRules();
        }

        workflowRules = getInternalWorkflowRules(workflowRules, filters, dbWorkflowRules);

        if(workflowRules && workflowRules.length>0){
            this.data.values = this.data.values.concat(workflowRules)
        }
    },
    afterCount: async function(){
        let filters = InternalData.parserFilters(this.query.filters)
        let workflowRules = [];
        let fObjectName = filters.object_name;

        if(fObjectName){
            delete filters.object_name;
        }
        let dbWorkflowRules = Creator.getCollection("workflow_rule").find(filters, {fields:{_id:1, name:1}}).fetch()

        if(fObjectName){
            workflowRules = await register.getObjectWorkflowRules(fObjectName);
        }else{
            workflowRules = await register.getAllWorkflowRules();
        }
        
        workflowRules = getInternalWorkflowRules(workflowRules, filters, dbWorkflowRules);

        if(workflowRules && workflowRules.length>0){
            this.data.values = this.data.values + workflowRules.length
        }
    },
    afterFindOne: async function(){
        if(_.isEmpty(this.data.values)){
            let id = this.id
            let workflowRule = await register.getWorkflowRule(id);
            if(workflowRule){
                this.data.values = workflowRule;
            }
        }
    },
}