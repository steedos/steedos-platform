const InternalData = require('../core/internalData');

module.exports = {
    afterFind: async function(){
        let filters = InternalData.parserFilters(this.query.filters)
        if(filters.object){
            let actions = InternalData.getObjectActions(filters.object, this.userId);
            if(actions){
                this.data.values = this.data.values.concat(actions)
            }
        }
    },
    afterAggregate: async function(){
        let filters = InternalData.parserFilters(this.query.filters)
        if(filters.object){
            let actions = InternalData.getObjectActions(filters.object, this.userId);
            if(actions){
                this.data.values = this.data.values.concat(actions)
            }
        }
    },
    afterCount: async function(){
        let filters = InternalData.parserFilters(this.query.filters)
        if(filters.object){
            let actions = InternalData.getObjectActions(filters.object, this.userId);
            if(actions){
                this.data.values = this.data.values + actions.length
            }
        }
    },
    afterFindOne: async function(){
        if(_.isEmpty(this.data.values)){
            let id = this.id
            let objectName = id.substr(0, id.indexOf("."));
            if(objectName){
                let action = InternalData.getObjectAction(objectName, this.userId, id);
                if(action){
                    this.data.values = action;
                }
            }
        }
    }
}