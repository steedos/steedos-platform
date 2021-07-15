const InternalData = require('../core/internalData');

module.exports = {
    afterFind: async function(){
        let filters = InternalData.parserFilters(this.query.filters)
        let listviews = []
        if(filters._id){
            let id = filters._id
            id = id.replace(/\\/g, '');
            if(_.isString(id)){
                let objectName = id.substr(0, id.indexOf("."));
                if(objectName){
                    let view = await InternalData.getObjectListView(objectName, this.userId, id);
                    if(view){
                        listviews = [view];
                    }
                }
            }
        }else if(filters.object_name){
            listviews = await InternalData.getObjectListViews(filters.object_name, this.userId);
        }
        if(listviews){
            this.data.values = this.data.values.concat(listviews)
        }
    },
    afterAggregate: async function(){
        let filters = InternalData.parserFilters(this.query.filters)
        let listviews = []
        if(filters._id){
            let id = filters._id
            id = id.replace(/\\/g, '');
            if(_.isString(id)){
                let objectName = id.substr(0, id.indexOf("."));
                if(objectName){
                    let view = await InternalData.getObjectListView(objectName, this.userId, id);
                    if(view){
                        listviews = [view];
                    }
                }
            }
        }else if(filters.object_name){
            listviews = await InternalData.getObjectListViews(filters.object_name, this.userId);
        }
        if(listviews){
            this.data.values = this.data.values.concat(listviews)
        }
    },
    afterCount: async function(){
        let filters = InternalData.parserFilters(this.query.filters)
        let listviews = []
        if(filters._id){
            let id = filters._id
            id = id.replace(/\\/g, '');
            if(_.isString(id)){
                let objectName = id.substr(0, id.indexOf("."));
                if(objectName){
                    let view = await InternalData.getObjectListView(objectName, this.userId, id);
                    if(view){
                        listviews = [view];
                    }
                }
            }
        }else if(filters.object_name){
            listviews = await InternalData.getObjectListViews(filters.object_name, this.userId);
        }
        if(listviews){
            this.data.values = this.data.values + listviews.length
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