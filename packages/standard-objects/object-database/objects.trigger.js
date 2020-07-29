const InternalData = require('../core/internalData');
module.exports = {
    afterFind: async function(){
        this.data.values = this.data.values.concat(InternalData.findObjects(this.userId, this.query.filters))
    },
    afterAggregate: async function(){
        this.data.values = this.data.values.concat(InternalData.findObjects(this.userId, this.query.filters))
    },
    afterCount: async function(){
        this.data.values = this.data.values + InternalData.findObjects(this.userId, this.query.filters).length
    },
    afterFindOne: async function(){
        if(_.isEmpty(this.data.values)){
            this.data.values = InternalData.getObject(this.id, this.userId);
        }
    }
}