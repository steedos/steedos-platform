const _ = require("underscore");
const util = require('@steedos/standard-objects').util;
const objectql = require("@steedos/objectql");
const InternalData = require('@steedos/standard-objects').internalData;

const checkReevaluateParent = (doc)=>{
    if(doc.reevaluate_on_change && doc.target_object && doc.object_name && doc.target_object != doc.object_name){
        throw new Error('action_field_updates_field__error_reevaluate_parent');
    }
}

const getInternalActionFieldUpdates = function(sourceActionFieldUpdates, filters, dbActionFieldUpdates){
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
        let fObjectName = filters.object_name;
        if(fObjectName){
            delete filters.object_name;
        }

        if(filters._id && filters._id.$ne){
            if(!_.isArray(filters._id.$ne)){
                filters._id.$ne = [filters._id.$ne]
            }
        }

        let dbActionFieldUpdates = Creator.getCollection("action_field_updates").find(filters, {fields:{_id:1, name:1}}).fetch();


        let actionFieldUpdates = [];
        
        if(filters.name && filters.name.$in){
            for(let name of filters.name.$in){
                let actionFieldUpdate = await objectql.getActionFieldUpdate(name);
                if(actionFieldUpdate){
                    actionFieldUpdates.push(actionFieldUpdate);
                }
            }
        }else if(filters._id && !filters._id.$ne){
            let action = await objectql.getActionFieldUpdate(filters._id);
            if(action){
                actionFieldUpdates.push(action);
            }
        }else if(fObjectName){
            actionFieldUpdates = await objectql.getObjectActionFieldUpdates(fObjectName);
        }else{
            actionFieldUpdates = await objectql.getAllActionFieldUpdates();
        }

        if(filters._id && filters._id.$ne){
            for(let neid of filters._id.$ne){
                actionFieldUpdates = _.filter(actionFieldUpdates, function(item){
                    return item._id !== neid
                })
            }
        }

        actionFieldUpdates = getInternalActionFieldUpdates(actionFieldUpdates, filters, dbActionFieldUpdates);

        if(actionFieldUpdates && actionFieldUpdates.length>0){
            this.data.values = this.data.values.concat(actionFieldUpdates)
        }
    },
    afterCount: async function(){
        let filters = InternalData.parserFilters(this.query.filters)

        let fObjectName = filters.object_name;
        if(fObjectName){
            delete filters.object_name;
        }

        if(filters._id && filters._id.$ne){
            if(!_.isArray(filters._id.$ne)){
                filters._id.$ne = [filters._id.$ne]
            }
        }

        let dbActionFieldUpdates = Creator.getCollection("action_field_updates").find(filters, {fields:{_id:1, name:1}}).fetch();

        let actionFieldUpdates = [];
        
        if(filters.name && filters.name.$in){
            for(let name of filters.name.$in){
                let actionFieldUpdate = await objectql.getActionFieldUpdate(name);
                if(actionFieldUpdate){
                    actionFieldUpdates.push(actionFieldUpdate);
                }
            }
        }else if(filters._id && !filters._id.$ne){
            let action = await objectql.getActionFieldUpdate(filters._id);
            if(action){
                actionFieldUpdates.push(action);
            }
        }else if(fObjectName){
            actionFieldUpdates = await objectql.getObjectActionFieldUpdates(fObjectName);
        }else{
            actionFieldUpdates = await  objectql.getAllActionFieldUpdates();
        }

        if(filters._id && filters._id.$ne){
            for(let neid of filters._id.$ne){
                actionFieldUpdates = _.filter(actionFieldUpdates, function(item){
                    return item._id !== neid
                })
            }
        }
        
        actionFieldUpdates = getInternalActionFieldUpdates(actionFieldUpdates, filters, dbActionFieldUpdates);

        if(actionFieldUpdates && actionFieldUpdates.length>0){
            this.data.values = this.data.values + actionFieldUpdates.length
        }
    },
    afterFindOne: async function(){
        if(_.isEmpty(this.data.values)){
            let id = this.id

            let dbFieldUpdate = Creator.getCollection("action_field_updates").find({name: id}).fetch();
            if(dbFieldUpdate && dbFieldUpdate.length > 0){
                this.data.values = dbFieldUpdate[0];
                return;
            }

            let actionFieldUpdate = await objectql.getActionFieldUpdate(id);
            if(actionFieldUpdate){
                this.data.values = actionFieldUpdate;
            }
        }
    },
}