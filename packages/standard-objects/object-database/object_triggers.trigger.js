const InternalData = require('../core/internalData');

module.exports = {
    afterFind: async function(){
        let filters = InternalData.parserFilters(this.query.filters)
        if(filters.object){
            let triggers = InternalData.getObjectTriggers(filters.object, this.userId);
            if(triggers){
                this.data.values = this.data.values.concat(triggers)
            }
        }
    },
    afterAggregate: async function(){
        let filters = InternalData.parserFilters(this.query.filters)
        if(filters.object){
            let triggers = InternalData.getObjectTriggers(filters.object, this.userId);
            if(triggers){
                this.data.values = this.data.values.concat(triggers)
            }
        }
    },
    afterCount: async function(){
        let filters = InternalData.parserFilters(this.query.filters)
        if(filters.object){
            let triggers = InternalData.getObjectTriggers(filters.object, this.userId);
            if(triggers){
                this.data.values = this.data.values + triggers.length
            }
        }
    },
    afterFindOne: async function(){
        if(_.isEmpty(this.data.values)){
            let id = this.id
            let objectName = id.substr(0, id.indexOf("."));
            if(objectName){
                let trigger = InternalData.getObjectTrigger(objectName, this.userId, id);
                if(trigger){
                    this.data.values = trigger;
                }
            }
        }
    }
}