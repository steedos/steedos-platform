const _ = require("underscore");
const objectql = require('@steedos/objectql');
const auth = require('@steedos/auth');
const InternalData = require('../core/internalData');
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
    },
    afterFind: async function(){
        let filters = InternalData.parserFilters(this.query.filters)
        let layouts = []
        if(filters._id){
            let id = filters._id
            id = id.replace(/\\/g, '');
            let objectName = id.substr(0, id.indexOf("."));
            if(objectName){
                let layout = await InternalData.getObjectLayout(id);
                if(layout){
                    layouts = [layout];
                }
            }
        }else if(filters.object_name){
            layouts = await InternalData.getObjectLayouts(filters.object_name, this.spaceId);
        }
        if(layouts){
            this.data.values = this.data.values.concat(_.filter(layouts, function(layout){return layout._id && layout._id.indexOf('.') > 0 }))
        }
    },
    afterAggregate: async function(){
        let filters = InternalData.parserFilters(this.query.filters)
        let layouts = []
        if(filters._id){
            let id = filters._id
            id = id.replace(/\\/g, '');
            let objectName = id.substr(0, id.indexOf("."));
            if(objectName){
                let layout = await InternalData.getObjectLayout(id);
                if(layout){
                    layouts = [layout];
                }
            }
        }else if(filters.object_name){
            layouts = await InternalData.getObjectLayouts(filters.object_name, this.spaceId);
        }
        if(layouts){
            this.data.values = this.data.values.concat(_.filter(layouts, function(layout){return layout._id && layout._id.indexOf('.') > 0 }))
        }
    },
    afterCount: async function(){
        // let result = await objectql.getObject('object_layouts').find(this.query, await auth.getSessionByUserId(this.userId, this.spaceId))
        // this.data.values = result.length;
        let filters = InternalData.parserFilters(this.query.filters)
        let layouts = []
        if(filters._id){
            let id = filters._id
            id = id.replace(/\\/g, '');
            let objectName = id.substr(0, id.indexOf("."));
            if(objectName){
                let layout = await InternalData.getObjectLayout(id);
                if(layout){
                    layouts = [layout];
                }
            }
        }else if(filters.object_name){
            layouts = await InternalData.getObjectLayouts(filters.object_name, this.spaceId);
        }
        if(layouts){
            this.data.values = this.data.values + _.filter(layouts, function(layout){return layout._id && layout._id.indexOf('.') > 0 }).length
        }
    },
    afterFindOne: async function(){
        if(_.isEmpty(this.data.values)){
            let id = this.id
            let objectName = id.substr(0, id.indexOf("."));
            if(objectName){
                let layout = await InternalData.getObjectLayout(id);
                if(layout){
                    this.data.values = layout;
                }
            }
        }
    }
}