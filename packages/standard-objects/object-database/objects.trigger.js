const InternalData = require('../core/internalData');
const _ = require('underscore');
module.exports = {
    afterFind: async function(){
        _.each(this.data.values, function(doc){
            doc.fields =  Object.assign({}, doc.fields, InternalData.getDefaultSysFields(doc.name, this.userId)) ;
        })
        this.data.values = this.data.values.concat(InternalData.findObjects(this.userId, this.query.filters))
    },
    afterAggregate: async function(){
        _.each(this.data.values, function(doc){
            doc.fields =  Object.assign({}, doc.fields, InternalData.getDefaultSysFields(doc.name, this.userId)) ;
        })
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