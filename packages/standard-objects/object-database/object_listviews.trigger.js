const InternalData = require('../core/internalData');
const util = require('../util');
const objectql = require('@steedos/objectql');

const getInternalListviews = async function(sourceListviews, filters, is_system){
    let collection = await objectql.getObject("object_listviews");
    let dbListviews = await collection.directFind({filters, fields:['_id', 'name']});
    let listviews = [];

    if(!is_system){
        _.forEach(sourceListviews, function(doc){
            if(!_.find(dbListviews, function(p){
                return p.name === doc.name
            })){
                listviews.push(doc);
            }
        })
    }
    return listviews;
}

module.exports = {
    beforeInsert: async function () {
        await util.checkAPIName(this.object_name, 'name', this.doc.name, undefined, [['is_system','!=', true], ['object_name','=', this.doc.object_name]]);

    },
    beforeUpdate: async function () {
        const oldDoc = await objectql.getObject(this.object_name).findOne(this.id)
        let name = oldDoc.name,object_name = oldDoc.object_name;
        if(_.has(this.doc, 'name')){
            name = this.doc.name
        }
        if(_.has(this.doc, 'object_name')){
            object_name = this.doc.object_name
        }
        await util.checkAPIName(this.object_name, 'name', name, this.id, [['is_system','!=', true], ['object_name','=', object_name]]);
    },
    afterFind: async function(){
        let filters = InternalData.parserFilters(this.query.filters)
        let views = []
        if(filters._id && !filters._id.$ne){
            let id = filters._id
            id = id.replace(/\\/g, '');
            if(_.isString(id)){
                let objectName = id.substr(0, id.indexOf("."));
                if(objectName){
                    let view = await InternalData.getObjectListView(objectName, this.userId, id);
                    if(view){
                        views = [view];
                    }
                }
            }
        }else if(filters.object_name){
            views = await InternalData.getObjectListViews(filters.object_name, this.userId);
        }

        views = await getInternalListviews(views, this.query.filters, filters.is_system);

        if(views){
            this.data.values = this.data.values.concat(views)
        }
    },
    afterAggregate: async function(){
        let filters = InternalData.parserFilters(this.query.filters)
        let views = []
        if(filters._id && !filters._id.$ne){
            let id = filters._id
            id = id.replace(/\\/g, '');
            if(_.isString(id)){
                let objectName = id.substr(0, id.indexOf("."));
                if(objectName){
                    let view = await InternalData.getObjectListView(objectName, this.userId, id);
                    if(view){
                        views = [view];
                    }
                }
            }
        }else if(filters.object_name){
            views = await InternalData.getObjectListViews(filters.object_name, this.userId);
        }

        views = await getInternalListviews(views, this.query.filters, filters.is_system);

        if(views){
            this.data.values = this.data.values.concat(views)
        }
    },
    afterCount: async function(){
        let filters = InternalData.parserFilters(this.query.filters)
        let views = []
        if(filters._id && !filters._id.$ne){
            let id = filters._id
            id = id.replace(/\\/g, '');
            if(_.isString(id)){
                let objectName = id.substr(0, id.indexOf("."));
                if(objectName){
                    let view = await InternalData.getObjectListView(objectName, this.userId, id);
                    if(view){
                        views = [view];
                    }
                }
            }
        }else if(filters.object_name){
            views = await InternalData.getObjectListViews(filters.object_name, this.userId);
        }

        views = await getInternalListviews(views, this.query.filters, filters.is_system);

        if(views){
            this.data.values = this.data.values + views.length
        }
    },
    afterFindOne: async function(){
        if(_.isEmpty(this.data.values)){
            let id = this.id
            if(_.isString(id)){
                let objectName = id.substr(0, id.indexOf("."));
                if(objectName){
                    let view = await InternalData.getObjectListView(objectName, this.userId, id);
                    if(view){
                        this.data.values = view;
                    }
                }
            }
        }
    }
}