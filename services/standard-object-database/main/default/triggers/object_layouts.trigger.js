const _ = require("underscore");
const objectql = require('@steedos/objectql');
function check(spaceId, objectName, profiles, id){
    let query = {
        object_name: objectName,
        profiles: {$in: profiles}
    }
    if(spaceId){
        query.space = spaceId;
    }
    if(id){
        query._id = {$ne: id}
    }
    let count = Creator.getCollection("object_layouts").find(query).count();

    if(count > 0){
        throw new Error("同一个对象、简档只能有一条记录");
    }
}

const getInternalLatouts = async function(sourceLayouts, filters){
    let collection = await objectql.getObject("object_layouts");
    let dbLayouts = await collection.directFind({filters, fields:['_id', 'name']});
    let layouts = [];

    if(!filters.is_system){
        _.forEach(sourceLayouts, function(doc){
            if(!_.find(dbLayouts, function(p){
                return p.name === doc.name
            })){
                layouts.push(doc);
            }
        })
    }
    return layouts;
}

module.exports = {
    beforeInsert: async function(){
        let doc = this.doc
        check(this.spaceId, doc.object_name, doc.profiles);

        await objectql.checkAPIName(this.object_name, 'name', this.doc.name, undefined, [['is_system','!=', true], ['object_name','=', doc.object_name]]);

        if(doc.fields){
            _.each(doc.fields, function(field){
                if(field && field.required && field.readonly){
                    field.readonly = false
                }
            })
        }
    },
    beforeUpdate: async function(){
        let doc = this.doc
        let id = this.id
        let record = Creator.getCollection("object_layouts").findOne({_id: id}) || {};
        check(this.spaceId, doc.object_name || record.object_name, doc.profiles || record.profiles, id);
        if (_.has(doc, 'name')) {
            await objectql.checkAPIName(this.object_name, 'name', doc.name, this.id, [['is_system','!=', true], ['object_name','=', doc.object_name || record.object_name]]);
        }

        if(doc.fields){
            _.each(doc.fields, function(field){
                if(field && field.required && field.readonly){
                    field.readonly = false
                }
            })
        }
    }
}