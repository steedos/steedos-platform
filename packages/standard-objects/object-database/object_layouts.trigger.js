const _ = require("underscore");

module.exports = {
    beforeInsert: function(){
        let doc = this.doc
        if(doc.fields){
            _.each(doc.fields, function(field){
                if(field && field.required && field.readonly){
                    field.readonly = false
                }
            })
        }
    },
    beforeUpdate: function(){
        let doc = this.doc
        if(doc.fields){
            _.each(doc.fields, function(field){
                if(field && field.required && field.readonly){
                    field.readonly = false
                }
            })
        }
    }
}