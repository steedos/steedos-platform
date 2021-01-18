const InternalData = require('../core/internalData');
const { getSummaryDataType, getObjectConfig, validateFilters } = require('@steedos/objectql');

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

const validateOptionColorValue = (value)=>{
    if(value){
        const reg = /^[\da-f]{6}$/i;
        if(!reg.test(value)){
            throw new Error("object_fields_error_option_color_not_valid");
        }
    }
}

const validateOptionsGridValue = (value)=>{
    if(value){
        value.forEach(function(option) {
            if(!option.label){
                throw new Error("object_fields_error_option_label_required");
            }
            if(!option.value){
                throw new Error("object_fields_error_option_value_required");
            }
            validateOptionColorValue(option.color);
        });
    }
}

const validateDoc = (doc)=>{
    validateOptionsGridValue(doc.options);
    // if(doc.type === "autonumber"){
    //     let formula = doc.formula && doc.formula.trim();
    //     if(!formula){
    //         throw new Error("object_fields_error_formula_required");
    //     }
    // }
}

const initSummaryDoc = (doc)=>{
    if(!doc.summary_object){
        throw new Error("object_fields_error_summary_object_required");
    }
    let summaryObject = getObjectConfig(doc.summary_object);
    let summaryConfig = { 
        summary_object: doc.summary_object, 
        summary_type: doc.summary_type, 
        summary_field: doc.summary_field, 
        field_name: doc._name + "__c", 
        object_name: doc.object
    };
    const dataType = getSummaryDataType(summaryConfig, summaryObject);
    if(!dataType){
        throw new Error("object_fields_error_summary_data_type_not_found");
    }
    doc.data_type = dataType;
    validateFilters(doc.summary_filters, summaryObject.fields);
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
    afterAggregate: async function(){
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
        validateDoc(doc);
        if(doc.type === "summary"){
            initSummaryDoc(doc);
        }
    },
    beforeUpdate: async function () {
        let doc = this.doc;
        validateDoc(doc);
        if(doc.type === "summary"){
            initSummaryDoc(doc);
        }
    }
}