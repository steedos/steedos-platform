const InternalData = require('../core/internalData');

const validateOptionValue = (value)=>{
    let color = value && value.split(":")[2];
    if(color){
        const reg = /^(#)?[\da-f]{3}([\da-f]{3})?$/i;
        if(!reg.test(color)){
            throw new Error("object_fields_error_option_color_not_valid");
        }
    }
}

const validateOptionsValue = (value)=>{
    if(value){
        value.split("\n").forEach(function(option) {
            let options;
            if (option.indexOf(",")) {
                options = option.split(",");
                return options.forEach(function(_option) {
                    validateOptionValue(_option);
                });
            } else {
                validateOptionValue(option);
            }
        });
    }
}

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
        let filters = InternalData.parserFilters(this.query.filters)
        if(filters.object){
            let fields = InternalData.getObjectFields(filters.object, this.userId);
            if(fields){
                this.data.values = this.data.values + fields.length
            }
        }
    },
    afterFindOne: async function(){
        if(_.isEmpty(this.data.values)){
            let id = this.id
            let objectName = id.substr(0, id.indexOf("."));
            if(objectName){
                let field = InternalData.getObjectField(objectName, this.userId, id);
                if(field){
                    this.data.values = field;
                }
            }
        }
    },
    beforeInsert: async function () {
        let doc = this.doc;
        validateOptionsValue(doc.options);
    },
    beforeUpdate: async function () {
        let doc = this.doc;
        validateOptionsValue(doc.options);
    }
}