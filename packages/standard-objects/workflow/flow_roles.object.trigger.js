const _ = require("underscore");
const objectql = require("@steedos/objectql");
const InternalData = require('../core/internalData');
const util = require('../util');

const getInternalFlowRoles = function(sourceFlowRoles, filters){
    let dbFlowRoles = Creator.getCollection("flow_roles").find(filters, {fields:{_id:1, api_name:1}}).fetch();
    let flowRoles = [];

    if(!filters.is_system){
        _.forEach(sourceFlowRoles, function(doc){
            if(!_.find(dbFlowRoles, function(p){
                return p.api_name === doc.api_name
            })){
                flowRoles.push(doc);
            }
        })
    }
    return flowRoles;
}

module.exports = {
    afterFind: async function(){
        let filters = InternalData.parserFilters(this.query.filters)
        let flowRoles = [];
        if(filters.api_name){
            flowRole = objectql.getSourceFlowRole(filters.api_name);
            if(flowRole){
                flowRoles.push(flowRole);
            }
        }else if(filters._id){
            roles = Creator.getCollection("flow_roles").find({api_name: filters._id}).fetch();
        }else{
            flowRoles = objectql.getSourceFlowRoles();
        }

        flowRoles = getInternalFlowRoles(flowRoles, filters);

        if(flowRoles){
            this.data.values = this.data.values.concat(flowRoles)
        }
    },
    afterAggregate: async function(){
        let filters = InternalData.parserFilters(this.query.filters)
        let flowRoles = [];
        if(filters.api_name){
            flowRole = objectql.getSourceFlowRole(filters.api_name);
            if(flowRole){
                flowRoles.push(flowRole);
            }
        }else if(filters._id){
            roles = Creator.getCollection("flow_roles").find({api_name: filters._id}).fetch();
        }else{
            flowRoles = objectql.getSourceFlowRoles();
        }

        flowRoles = getInternalFlowRoles(flowRoles, filters);

        if(flowRoles){
            this.data.values = this.data.values.concat(flowRoles)
        }
    },
    afterCount: async function(){
        let filters = InternalData.parserFilters(this.query.filters)
        let flowRoles = [];
        if(filters.api_name){
            flowRole = objectql.getSourceFlowRole(filters.api_name);
            if(flowRole){
                flowRoles.push(flowRole);
            }
        }else if(filters._id){
            roles = Creator.getCollection("flow_roles").find({api_name: filters._id}).fetch();
        }else{
            flowRoles = objectql.getSourceFlowRoles();
        }

        flowRoles = getInternalFlowRoles(flowRoles, filters);

        if(flowRoles){
            this.data.values = this.data.values + flowRoles.length
        }
    },
    afterFindOne: async function(){
        if(_.isEmpty(this.data.values)){
            let id = this.id
            if(id){

                let dbFlowRole = Creator.getCollection("flow_roles").find({api_name: id}).fetch();
                if(dbFlowRole && dbFlowRole.length > 0){
                    this.data.values = dbFlowRole[0];
                    return;
                }

                let flowRole = objectql.getSourceFlowRole(id);
                if(flowRole){
                    this.data.values = flowRole;
                }
            }
        }
    }
}