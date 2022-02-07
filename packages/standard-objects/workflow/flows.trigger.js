const _ = require('underscore');
const objectql = require("@steedos/objectql");
const internalData = require("../core/internalData");
const clone = require("clone");
const util = require('../util');

function getFlows(){
    return clone(objectql.getConfigs("flow"));
}

async function createObjectWorkflow(doc) {
    const objectName = doc.object_name;
    const owObj = objectql.getObject('object_workflows');
    const count = await owObj.count({ filters: [['space', '=', doc.space],['flow_id', '=', doc._id],['object_name', '=', objectName] ]});
    if (count == 0) {
        const objectConfig = await objectql.getObject(objectName).toConfig();
        const baseInfo = {
            space: doc.space,
            company_id: doc.company_id,
            owner: doc.owner,
            created: new Date(),
            created_by: doc.created_by
        };
        await owObj.insert({
            ...baseInfo,
            name: `${doc.name}-${objectConfig.label}`,
            object_name: objectName,
            flow_id: doc._id,
            sync_attachment: 'null',
            sync_type: 'every_step',
            sync_direction: 'both'
        })
    }
}

module.exports = {
    beforeInsert: async function () {
        if(this.doc.api_name){
            await util.checkAPIName(this.object_name, 'api_name', this.doc.api_name, undefined, undefined);
        }
    },
    beforeUpdate: async function () {
        let api_name = null;
        if(_.has(this.doc, 'api_name')){
            api_name = this.doc.api_name
        }
        if(api_name){
            await util.checkAPIName(this.object_name, 'api_name', api_name, this.id, null);
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
    afterInsert: async function(){
        const { doc } = this;
        if (doc.object_name) {
            await createObjectWorkflow(doc);
        }
    },
    afterUpdate: async function(){
        const { doc, previousDoc, id } = this;
        let objectName = doc.object_name;
        if (objectName && objectName != previousDoc.object_name) {
            const updatedDoc = await this.getObject(this.object_name).findOne(id);
            await createObjectWorkflow(updatedDoc);
        }
    },
}