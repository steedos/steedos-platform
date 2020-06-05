const InternalData = require('../core/internalData');
module.exports = {
    afterFind: async function(){
        this.data.values = this.data.values.concat(InternalData.getObjects(this.userId))
    },
    afterFindOne: async function(){
        if(_.isEmpty(this.data.values)){
            this.data.values = InternalData.getObject(this.id, this.userId);
        }
    }
}