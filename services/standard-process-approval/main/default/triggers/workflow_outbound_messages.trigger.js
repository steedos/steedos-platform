const _ = require("underscore");
const util = require('@steedos/standard-objects').util;
const objectql = require("@steedos/objectql");
const InternalData = require('@steedos/standard-objects').internalData;

const getInternalOutboundMessages = function(sourceOutboundMessages, filters, dbOutboundMessages){
    let messages = [];

    if(!filters.is_system){
        _.forEach(sourceOutboundMessages, function(doc){
            if(!_.find(dbOutboundMessages, function(p){
                return p.name === doc.name
            })){
                messages.push(doc);
            }
        })
    }
    return messages;
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
        let fObjectName = filters.object_name;

        if(fObjectName){
            delete filters.object_name;
        }

        if(filters._id && filters._id.$ne){
            if(!_.isArray(filters._id.$ne)){
                filters._id.$ne = [filters._id.$ne]
            }
        }

        let dbOutboundMessages = Creator.getCollection("workflow_outbound_messages").find(filters, {fields:{_id:1, name:1}}).fetch();

        let messages = [];
        if(filters.name && filters.name.$in){
            for(let _name of filters.name.$in){
                let message = await objectql.getWorkflowOutboundMessage(_name);
                if(message){
                    messages.push(message);
                }
            }
        }else if(filters._id && !filters._id.$ne){
            let message = await objectql.getWorkflowOutboundMessage(filters._id);
            if(message){
                messages.push(message);
            }
        }else if(fObjectName){
            messages = await objectql.getObjectWorkflowOutboundMessages(fObjectName);
        }else{
            messages = await objectql.getAllWorkflowOutboundMessages();
        }
        
        if(filters._id && filters._id.$ne){
            for(let neid of filters._id.$ne){
                messages = _.filter(messages, function(item){
                    return item._id !== neid
                })
            }
        }

        messages = getInternalOutboundMessages(messages, filters, dbOutboundMessages);

        if(messages && messages.length>0){
            this.data.values = this.data.values.concat(messages)
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

        let dbOutboundMessages = Creator.getCollection("workflow_outbound_messages").find(filters, {fields:{_id:1, name:1}}).fetch();
        let messages = [];
        if(filters._id && filters._id.$in){
            for(let id of filters._id.$in){
                let message = await objectql.getWorkflowOutboundMessage(id);
                if(message){
                    messages.push(message);
                }
            }
        }else if(filters._id && !filters._id.$ne){
            let message = await objectql.getWorkflowOutboundMessage(filters._id);
            if(message){
                messages.push(message);
            }
        }else if(fObjectName){
            messages = await objectql.getObjectWorkflowOutboundMessages(fObjectName);
        }else{
            messages = await objectql.getAllWorkflowOutboundMessages();
        }
        
        if(filters._id && filters._id.$ne){
            for(let neid of filters._id.$ne){
                messages = _.filter(messages, function(item){
                    return item._id !== neid
                })
            }
        }
        
        messages = getInternalOutboundMessages(messages, filters, dbOutboundMessages);

        if(messages && messages.length>0){
            this.data.values = this.data.values + messages.length
        }
    },
    afterFindOne: async function(){
        if(_.isEmpty(this.data.values)){
            let id = this.id

            let dbNotification = Creator.getCollection("workflow_outbound_messages").find({name: id}).fetch();
            if(dbNotification && dbNotification.length > 0){
                this.data.values = dbNotification[0];
                return;
            }

            let message = await objectql.getWorkflowOutboundMessage(id);
            if(message){
                this.data.values = message;
            }
        }
    },
}