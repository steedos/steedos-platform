const InternalData = require('../core/internalData');
const _ = require('underscore');
const objectql = require('@steedos/objectql');
const objectTree = require('./objects.tree.js');

module.exports = {
    afterFind: async function(){
        let userId = this.userId
        let spaceId = this.spaceId;
        for (const doc of this.data.values) {
            doc.fields =  Object.assign({}, doc.fields, await InternalData.getDefaultSysFields(doc.name, userId)) ;
        }
        // this.data.values = this.data.values.concat(await InternalData.findObjects(userId, this.query.filters));

        this.data.values = this.data.values.concat(await InternalData.getObjects(userId));

        this.data.values = objectql.getSteedosSchema().metadataDriver.find(this.data.values, this.query, spaceId);
        
        _.each(this.data.values, function(value){
            if(value){
                delete value.actions;
                delete value.fields;
                delete value.list_views;
                delete value.permission_set;
                delete value.triggers;
            }
        })
    },
    afterAggregate: async function(){
        let userId = this.userId
        let spaceId = this.spaceId;
        for (const doc of this.data.values) {
            doc.fields =  Object.assign({}, doc.fields, await InternalData.getDefaultSysFields(doc.name, userId)) ;
        }
        // this.data.values = this.data.values.concat(await InternalData.findObjects(userId, this.query.filters));

        this.data.values = this.data.values.concat(await InternalData.getObjects(userId));

        this.data.values = objectql.getSteedosSchema().metadataDriver.find(this.data.values, this.query, spaceId);
        
        _.each(this.data.values, function(value){
            if(value){
                delete value.actions;
                delete value.fields;
                delete value.list_views;
                delete value.permission_set;
                delete value.triggers;
            }
        })
    },
    afterCount: async function(){
        let userId = this.userId
        let spaceId = this.spaceId;
        this.data.values = this.data.values + objectql.getSteedosSchema().metadataDriver.count(await InternalData.getObjects(userId), this.query, spaceId);
    },
    afterFindOne: async function(){
        if(_.isEmpty(this.data.values)){
            this.data.values = await InternalData.getObject(this.id, this.userId);
        }
        if(this.data.values){
            delete this.data.values.actions;
            delete this.data.values.fields;
            delete this.data.values.list_views;
            delete this.data.values.permission_set;
            delete this.data.values.triggers;
        }
    },
    afterInsert: async function(){
        const doc = this.doc;
        if(doc.enable_tree){
            objectTree.insertParentAndChildrenFieldForTreeObject(doc)
        }
        // let spaceProfiles = await objectql.getObject('permission_set').find({space: this.spaceId, type: 'profile'});
        // await objectql.getObject('object_layouts').insert({
        //     label: 'default',
        //     object_name: this.doc.name,
        //     actions: _.keys(Creator.getObject('base').actions),
        //     profiles: _.pluck(spaceProfiles, 'name'),
        //     fields: [{
        //         field: 'name',
        //     },{
        //         field: 'created',
        //     },{
        //         field: 'created_by',
        //     },{
        //         field: 'modified',
        //     },{
        //         field: 'modified_by',
        //     }],
        //     space: this.spaceId
        // })
    }
}