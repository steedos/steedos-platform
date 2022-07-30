const _ = require("underscore");
const objectql = require('@steedos/objectql');
const auth = require('@steedos/auth');
const InternalData = require('@steedos/standard-objects').internalData;
const util = require('@steedos/standard-objects').util
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
        check(doc.object_name, doc.profiles);

        await util.checkAPIName(this.object_name, 'name', this.doc.name, undefined, [['is_system','!=', true], ['object_name','=', doc.object_name]]);

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
        check(doc.object_name || record.object_name, doc.profiles || record.profiles, id);
        if (_.has(doc, 'name')) {
            await util.checkAPIName(this.object_name, 'name', doc.name, this.id, [['is_system','!=', true], ['object_name','=', doc.object_name || record.object_name]]);
        }

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
        if(filters._id && !filters._id.$ne){
            let id = filters._id
            id = id.replace(/\\/g, '');
            let objectName = id.substr(0, id.indexOf("."));
            if(objectName){
                let layout = await InternalData.getObjectLayout(id);
                if(layout){
                    layouts = [layout]
                }
            }
        }else if(filters.object_name){
            layouts = await InternalData.getObjectLayouts(filters.object_name, this.spaceId);
        }

        layouts = await getInternalLatouts(layouts, filters);

        if(layouts){
            this.data.values = this.data.values.concat(_.filter(layouts, function(layout){return layout._id && layout._id.indexOf('.') > 0 }))
        }
    },
    afterAggregate: async function(){
        let filters = InternalData.parserFilters(this.query.filters)
        let layouts = []
        if(filters._id && !filters._id.$ne){
            let id = filters._id
            id = id.replace(/\\/g, '');
            let objectName = id.substr(0, id.indexOf("."));
            if(objectName){
                let layout = await InternalData.getObjectLayout(id);
                if(layout){
                    layouts = [layout]
                }
            }
        }else if(filters.object_name){
            layouts = await InternalData.getObjectLayouts(filters.object_name, this.spaceId);
        }

        layouts = await getInternalLatouts(layouts, filters);

        if(layouts){
            this.data.values = this.data.values.concat(_.filter(layouts, function(layout){return layout._id && layout._id.indexOf('.') > 0 }))
        }
    },
    afterCount: async function(){
        // let result = await objectql.getObject('object_layouts').find(this.query, await auth.getSessionByUserId(this.userId, this.spaceId))
        // this.data.values = result.length;
        let filters = InternalData.parserFilters(this.query.filters)
        let layouts = []
        if(filters._id && !filters._id.$ne){
            let id = filters._id
            id = id.replace(/\\/g, '');
            let objectName = id.substr(0, id.indexOf("."));
            if(objectName){
                let layout = await InternalData.getObjectLayout(id);
                if(layout){
                    layouts = [layout]
                }
            }
        }else if(filters.object_name){
            layouts = await InternalData.getObjectLayouts(filters.object_name, this.spaceId);
        }

        layouts = await getInternalLatouts(layouts, filters);
        
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