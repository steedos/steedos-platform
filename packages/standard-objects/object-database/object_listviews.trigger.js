const InternalData = require('../core/internalData');

module.exports = {
    afterFind: async function(){
        let filters = InternalData.parserFilters(this.query.filters)
        if(filters.object_name){
            let views = InternalData.getObjectListViews(filters.object_name, this.userId);
            if(views){
                this.data.values = this.data.values.concat(views)
            }
        }
    },
    afterAggregate: async function(){
        let filters = InternalData.parserFilters(this.query.filters)
        if(filters.object_name){
            let views = InternalData.getObjectListViews(filters.object_name, this.userId);
            if(views){
                this.data.values = this.data.values.concat(views)
            }
        }
    },
    afterCount: async function(){
        let filters = InternalData.parserFilters(this.query.filters)
        if(filters.object_name){
            let views = InternalData.getObjectListViews(filters.object_name, this.userId);
            if(views){
                this.data.values = this.data.values + views.length
            }
        }
    },
    afterFindOne: async function(){
        if(_.isEmpty(this.data.values)){
            let id = this.id
            if(_.isString(id)){
                let objectName = id.substr(0, id.indexOf("."));
                if(objectName){
                    let view = InternalData.getObjectListView(objectName, this.userId, id);
                    if(view){
                        this.data.values = view;
                    }
                }
            }
        }
    }
}