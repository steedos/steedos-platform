const InternalData = require('../core/internalData');

module.exports = {
    afterFind: async function(){
        let filters = InternalData.parserFilters(this.query.filters)
        if(filters.object){
            let fields = InternalData.getObjectFields(filters.object, this.userId);
            if(fields){
                this.data.values = this.data.values.concat(fields)
            }
        }
    },
    afterCount: async function(){
        this.data.values = this.data.values + 1
    },
    afterFindOne: async function(){
        console.log('afterFindOne this', this);
        if(_.isEmpty(this.data.values)){
            let id = this.id
            let objectName = id.substr(0, id.indexOf("_"));
            if(objectName){
                let field = InternalData.getObjectField(objectName, this.userId, id);
                if(field){
                    this.data.values = field;
                }
            }
        }
    }
}