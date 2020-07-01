const _ = require("underscore");
function check(objectName, profiles, id){
    let query = {
        object_name: objectName,
        profiles: {$in: profiles}
    }
    if(id){
        query._id = {$ne: id}
    }
    let count = Creator.getCollection("object_layouts").find(query).count();

    if(count > 0){
        throw new Error("同一个对象、简档只能有一条记录");
    }
}
module.exports = {
    beforeInsert: function(){
        let doc = this.doc
        check(doc.object_name, doc.profiles);
        if(doc.fields){
            _.each(doc.fields, function(field){
                if(field && field.required && field.readonly){
                    field.readonly = false
                }
            })
        }
    },
    beforeUpdate: function(){
        let doc = this.doc
        let id = this.id
        let record = Creator.getCollection("object_layouts").findOne({_id: id}) || {};
        check(doc.object_name || record.object_name, doc.profiles || record.profiles, id);
        if(doc.fields){
            _.each(doc.fields, function(field){
                if(field && field.required && field.readonly){
                    field.readonly = false
                }
            })
        }
    }
}