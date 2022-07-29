const _ = require("underscore");
const util = require('@steedos/standard-objects').util;
const objectql = require("@steedos/objectql");
const InternalData = require('@steedos/standard-objects').internalData;

const getInternalWorkflowNotifications = function(sourceWorkflowNotifications, filters){
    let dbWorkflowNotifications = Creator.getCollection("workflow_notifications").find(filters, {fields:{_id:1, name:1}}).fetch();
    let workflowNotifications = [];

    if(!filters.is_system){
        _.forEach(sourceWorkflowNotifications, function(doc){
            if(!_.find(dbWorkflowNotifications, function(p){
                return p.name === doc.name
            })){
                workflowNotifications.push(doc);
            }
        })
    }
    return workflowNotifications;
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
        let workflowNotifications = [];
        if(filters.name && filters.name.$in){
            for(let _name of filters.name.$in){
                let workflowNotification = objectql.getWorkflowNotification(_name);
                if(workflowNotification){
                    workflowNotifications.push(workflowNotification);
                }
            }
        }else if(filters._id && !filters._id.$ne){
            let notification = objectql.getWorkflowNotification(filters._id);
            if(notification){
                workflowNotifications.push(notification);
            }
        }else if(filters.object_name){
            workflowNotifications = objectql.getObjectWorkflowNotifications(filters.object_name);
            delete filters.object_name;
        }else{
            workflowNotifications = objectql.getAllWorkflowNotifications();
        }
        
        if(filters._id && filters._id.$ne){
            if(!_.isArray(filters._id.$ne)){
                filters._id.$ne = [filters._id.$ne]
            }
            for(let neid of filters._id.$ne){
                workflowNotifications = _.filter(workflowNotifications, function(item){
                    return item._id !== neid
                })
            }
        }

        workflowNotifications = getInternalWorkflowNotifications(workflowNotifications, filters);

        if(workflowNotifications && workflowNotifications.length>0){
            this.data.values = this.data.values.concat(workflowNotifications)
        }
    },
    afterAggregate: async function(){
        let filters = InternalData.parserFilters(this.query.filters)
        let workflowNotifications = [];
        if(filters._id && filters._id.$in){
            for(let id of filters._id.$in){
                let workflowNotification = objectql.getWorkflowNotification(id);
                if(workflowNotification){
                    workflowNotifications.push(workflowNotification);
                }
            }
        }else if(filters._id && !filters._id.$ne){
            let notification = objectql.getWorkflowNotification(filters._id);
            if(notification){
                workflowNotifications.push(notification);
            }
        }else if(filters.object_name){
            workflowNotifications = objectql.getObjectWorkflowNotifications(filters.object_name);
            delete filters.object_name;
        }else{
            workflowNotifications = objectql.getAllWorkflowNotifications();
        }
        
        if(filters._id && filters._id.$ne){
            if(!_.isArray(filters._id.$ne)){
                filters._id.$ne = [filters._id.$ne]
            }
            for(let neid of filters._id.$ne){
                workflowNotifications = _.filter(workflowNotifications, function(item){
                    return item._id !== neid
                })
            }
        }
    },
    afterFind: async function(){
        let filters = InternalData.parserFilters(this.query.filters)
        let workflowNotifications = [];
        if(filters.name && filters.name.$in){
            for(let _name of filters.name.$in){
                let workflowNotification = objectql.getWorkflowNotification(_name);
                if(workflowNotification){
                    workflowNotifications.push(workflowNotification);
                }
            }
        }else if(filters._id && !filters._id.$ne){
            let notification = objectql.getWorkflowNotification(filters._id);
            if(notification){
                workflowNotifications.push(notification);
            }
        }else if(filters.object_name){
            workflowNotifications = objectql.getObjectWorkflowNotifications(filters.object_name);
            delete filters.object_name;
        }else{
            workflowNotifications = objectql.getAllWorkflowNotifications();
        }
        
        if(filters._id && filters._id.$ne){
            if(!_.isArray(filters._id.$ne)){
                filters._id.$ne = [filters._id.$ne]
            }
            for(let neid of filters._id.$ne){
                workflowNotifications = _.filter(workflowNotifications, function(item){
                    return item._id !== neid
                })
            }
        }

        workflowNotifications = getInternalWorkflowNotifications(workflowNotifications, filters);

        if(workflowNotifications && workflowNotifications.length>0){
            this.data.values = this.data.values.concat(workflowNotifications)
        }
    },
    afterAggregate: async function(){
        let filters = InternalData.parserFilters(this.query.filters)
        let workflowNotifications = [];
        if(filters._id && filters._id.$in){
            for(let id of filters._id.$in){
                let workflowNotification = objectql.getWorkflowNotification(id);
                if(workflowNotification){
                    workflowNotifications.push(workflowNotification);
                }
            }
        }else if(filters._id && !filters._id.$ne){
            let notification = objectql.getWorkflowNotification(filters._id);
            if(notification){
                workflowNotifications.push(notification);
            }
        }else if(filters.object_name){
            workflowNotifications = objectql.getObjectWorkflowNotifications(filters.object_name);
            delete filters.object_name;
        }else{
            workflowNotifications = objectql.getAllWorkflowNotifications();
        }
        
        if(filters._id && filters._id.$ne){
            if(!_.isArray(filters._id.$ne)){
                filters._id.$ne = [filters._id.$ne]
            }
            for(let neid of filters._id.$ne){
                workflowNotifications = _.filter(workflowNotifications, function(item){
                    return item._id !== neid
                })
            }
        }

        workflowNotifications = getInternalWorkflowNotifications(workflowNotifications, filters);

        if(workflowNotifications && workflowNotifications.length>0){
            this.data.values = this.data.values.concat(workflowNotifications)
        }
    },
    afterCount: async function(){
        let filters = InternalData.parserFilters(this.query.filters)
        let workflowNotifications = [];
        if(filters._id && filters._id.$in){
            for(let id of filters._id.$in){
                let workflowNotification = objectql.getWorkflowNotification(id);
                if(workflowNotification){
                    workflowNotifications.push(workflowNotification);
                }
            }
        }else if(filters._id && !filters._id.$ne){
            let notification = objectql.getWorkflowNotification(filters._id);
            if(notification){
                workflowNotifications.push(notification);
            }
        }else if(filters.object_name){
            workflowNotifications = objectql.getObjectWorkflowNotifications(filters.object_name);
            delete filters.object_name;
        }else{
            workflowNotifications = objectql.getAllWorkflowNotifications();
        }
        
        if(filters._id && filters._id.$ne){
            if(!_.isArray(filters._id.$ne)){
                filters._id.$ne = [filters._id.$ne]
            }
            for(let neid of filters._id.$ne){
                workflowNotifications = _.filter(workflowNotifications, function(item){
                    return item._id !== neid
                })
            }
        }
        
        workflowNotifications = getInternalWorkflowNotifications(workflowNotifications, filters);

        if(workflowNotifications && workflowNotifications.length>0){
            this.data.values = this.data.values + workflowNotifications.length
        }
    },
    afterFindOne: async function(){
        if(_.isEmpty(this.data.values)){
            let id = this.id

            let dbNotification = Creator.getCollection("workflow_notifications").find({name: id}).fetch();
            if(dbNotification && dbNotification.length > 0){
                this.data.values = dbNotification[0];
                return;
            }

            let workflowNotification = objectql.getWorkflowNotification(id);
            if(workflowNotification){
                this.data.values = workflowNotification;
            }
        }
    },
}