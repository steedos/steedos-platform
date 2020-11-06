const InternalData = require('../core/internalData');
const _ = require('underscore');
const objectql = require('@steedos/objectql');
console.log('load objects.trigger.js');
module.exports = {
    afterFind: async function(){
        let userId = this.userId
        _.each(this.data.values, function(doc){
            doc.fields =  Object.assign({}, doc.fields, InternalData.getDefaultSysFields(doc.name, userId)) ;
        })
        this.data.values = this.data.values.concat(InternalData.findObjects(userId, this.query.filters))
    },
    afterAggregate: async function(){
        let userId = this.userId
        _.each(this.data.values, function(doc){
            doc.fields =  Object.assign({}, doc.fields, InternalData.getDefaultSysFields(doc.name, userId)) ;
        })
        this.data.values = this.data.values.concat(InternalData.findObjects(userId, this.query.filters))
    },
    afterCount: async function(){
        this.data.values = this.data.values + InternalData.findObjects(this.userId, this.query.filters).length
    },
    afterFindOne: async function(){
        if(_.isEmpty(this.data.values)){
            this.data.values = InternalData.getObject(this.id, this.userId);
        }
    },
    afterInsert: async function(){
        console.log('object afterInsert....');
        let spaceProfiles = await objectql.getObject('permission_set').find({space: this.spaceId, type: 'profile'});
        await objectql.getObject('object_layouts').insert({
            label: 'default',
            object_name: this.doc.name,
            actions: _.keys(Creator.getObject('base').actions),
            profiles: _.pluck(spaceProfiles, 'name'),
            fields: [{
                field: 'name',
            },{
                field: 'created',
            },{
                field: 'created_by',
            },{
                field: 'modified',
            },{
                field: 'modified_by',
            }],
            space: this.spaceId
        })
    }
}