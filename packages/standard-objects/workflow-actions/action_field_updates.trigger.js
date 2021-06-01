const _ = require("underscore");
const util = require('../util');
const objectql = require("@steedos/objectql");
const InternalData = require('../core/internalData');

const checkReevaluateParent = (doc)=>{
    if(doc.reevaluate_on_change && doc.target_object && doc.object_name && doc.target_object != doc.object_name){
        throw new Error('action_field_updates_field__error_reevaluate_parent');
    }
}

const getInternalActionFieldUpdates = function(sourceActionFieldUpdates, filters){
    let dbActionFieldUpdates = Creator.getCollection("action_field_updates").find(filters, {fields:{_id:1, name:1}}).fetch();
    let actionFieldUpdates = [];

    if(!filters.is_system){
        _.forEach(sourceActionFieldUpdates, function(doc){
            if(!_.find(dbActionFieldUpdates, function(p){
                return p.name === doc.name
            })){
                actionFieldUpdates.push(doc);
            }
        })
    }
    return actionFieldUpdates;
}

module.exports = {
    beforeInsert: async function () {
        await util.checkAPIName(this.object_name, 'name', this.doc.name, undefined, [['is_system','!=', true]]);
        checkReevaluateParent(this.doc);
    },
    beforeUpdate: async function () {
        if (_.has(this.doc, 'name')) {
            await util.checkAPIName(this.object_name, 'name', this.doc.name, this.id, [['is_system','!=', true]]);
        }
        checkReevaluateParent(this.doc);
    },
    afterFind: async function(){
        let filters = InternalData.parserFilters(this.query.filters)
        let actionFieldUpdates = [];
        
        if(filters._id && filters._id.$in){
            for(let id of filters._id.$in){
                let objectName = id.substr(0, id.indexOf("."));
                if(objectName){
                    let actionFieldUpdate = objectql.getObjectActionFieldUpdate(objectName, id.substr(id.indexOf(".")+1));
                    if(actionFieldUpdate){
                        actionFieldUpdates.push(actionFieldUpdate);
                    }
                }
            }
        }else if(filters.object_name){
            actionFieldUpdates = objectql.getObjectActionFieldUpdates(filters.object_name);
            delete filters.object_name;
        }else{
            actionFieldUpdates = objectql.getAllActionFieldUpdates();
        }

        actionFieldUpdates = getInternalActionFieldUpdates(actionFieldUpdates, filters);

        if(actionFieldUpdates && actionFieldUpdates.length>0){
            this.data.values = this.data.values.concat(actionFieldUpdates)
        }
    },
    afterAggregate: async function(){
        let filters = InternalData.parserFilters(this.query.filters)
        let actionFieldUpdates = [];
        if(filters.object_name){
            actionFieldUpdates = objectql.getObjectActionFieldUpdates(filters.object_name);
            delete filters.object_name;
        }else{
            actionFieldUpdates = objectql.getAllActionFieldUpdates();
        }
        
        actionFieldUpdates = getInternalActionFieldUpdates(actionFieldUpdates, filters);

        if(actionFieldUpdates && actionFieldUpdates.length>0){
            this.data.values = this.data.values.concat(actionFieldUpdates)
        }
    },
    afterCount: async function(){
        let filters = InternalData.parserFilters(this.query.filters)
        let actionFieldUpdates = [];
        if(filters.object_name){
            actionFieldUpdates = objectql.getObjectActionFieldUpdates(filters.object_name);
            delete filters.object_name;
        }else{
            actionFieldUpdates = objectql.getAllActionFieldUpdates();
        }
        
        actionFieldUpdates = getInternalActionFieldUpdates(actionFieldUpdates, filters);

        if(actionFieldUpdates && actionFieldUpdates.length>0){
            this.data.values = this.data.values + actionFieldUpdates.length
        }
    },
    afterFindOne: async function(){
        if(_.isEmpty(this.data.values)){
            let id = this.id
            let objectName = id.substr(0, id.indexOf("."));
            if(objectName){
                let actionFieldUpdate = objectql.getObjectActionFieldUpdate(objectName, id.substr(id.indexOf(".")+1));
                if(actionFieldUpdate){
                    this.data.values = actionFieldUpdate;
                }
            }
        }
    },
}