const _ = require('underscore');
const objectql = require("@steedos/objectql");
const internalData = require("../core/internalData");
const clone = require("clone");
const util = require('../util');

function getFlows(){
    return clone(objectql.getConfigs("flow"));
}

module.exports = {
    beforeInsert: async function () {
        if(this.doc.api_name && this.doc.space){
            await util.checkAPIName(this.object_name, 'api_name', this.doc.api_name, undefined, [['space', '=', this.doc.space]]);
        }
    },
    beforeUpdate: async function () {
        let api_name = null;
        if(_.has(this.doc, 'api_name')){
            api_name = this.doc.api_name
        }
        const spaceId = this.spaceId
        if(api_name && spaceId){
            await util.checkAPIName(this.object_name, 'api_name', api_name, this.id, [['space', '=', spaceId]]);
        }
    },
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
    },

}