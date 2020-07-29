const _ = require('underscore');
const objectql = require("@steedos/objectql");
const internalData = require("../core/internalData");
const clone = require("clone");

function getFlows(){
    return clone(objectql.getConfigs("flow"));
}

module.exports = {
    afterFind: async function(){
        if(this.spaceId === 'template'){
            let filters = internalData.parserFilters(this.query.filters)
            let flowDatas = getFlows();
            if(filters.category){
                flowDatas = _.filter(flowDatas, function(flow){
                    return flow.category === filters.category
                })
            }

            let search = this.query.filters.split("contains");
            if(search.length > 1 && search[1].split('\'')){
                let searchStr = search[1].split('\'')[1];
                flowDatas = _.filter(flowDatas, function(flow){
                    return flow.name.indexOf(searchStr) > -1 || (flow.description && flow.description.indexOf(searchStr) > -1)
                })
            }
            this.data.values = this.data.values.concat(flowDatas)
        }
    },
    afterAggregate: async function(){
        if(this.spaceId === 'template'){
            let filters = internalData.parserFilters(this.query.filters)
            let flowDatas = getFlows();
            if(filters.category){
                flowDatas = _.filter(flowDatas, function(flow){
                    return flow.category === filters.category
                })
            }

            let search = this.query.filters.split("contains");
            if(search.length > 1 && search[1].split('\'')){
                let searchStr = search[1].split('\'')[1];
                flowDatas = _.filter(flowDatas, function(flow){
                    return flow.name.indexOf(searchStr) > -1 || (flow.description && flow.description.indexOf(searchStr) > -1)
                })
            }
            this.data.values = this.data.values.concat(flowDatas)
        }
    },
    afterFindOne: async function(){
        let id = this.id;
        if(id && _.isEmpty(this.data.values) && this.spaceId === 'template'){
            this.data.values = _.find(getFlows(), function(flow){
                return flow._id === id;
            })
        }
    }
}