const _ = require("underscore");
const util = require('../util');
const objectql = require("@steedos/objectql");
const InternalData = require('../core/internalData');

module.exports = {
    afterFind: async function(){
        let filters = InternalData.parserFilters(this.query.filters)
        let validationRules;
        if(filters.object_name){
            validationRules = objectql.getObjectValidationRules(filters.object_name);
        }else{
            validationRules = objectql.getAllObjectValidationRules();
        }
        if(validationRules){
            this.data.values = this.data.values.concat(validationRules)
        }
    },
    afterAggregate: async function(){
        let filters = InternalData.parserFilters(this.query.filters)
        if(filters.object_name){
            let validationRules = objectql.getObjectValidationRules(filters.object_name);
            if(validationRules){
                this.data.values = this.data.values.concat(validationRules)
            }
        }
    },
    afterCount: async function(){
        let filters = InternalData.parserFilters(this.query.filters)
        if(filters.object_name){
            let validationRules = objectql.getObjectValidationRules(filters.object_name);
            if(validationRules){
                this.data.values = this.data.values + validationRules.length
            }
        }
    },
    afterFindOne: async function(){
        if(_.isEmpty(this.data.values)){
            let id = this.id
            let objectName = id.substr(0, id.indexOf("."));
            if(objectName){
                let validationRule = objectql.getObjectValidationRule(objectName, id.substr(id.indexOf(".")+1));
                if(validationRule){
                    this.data.values = validationRule;
                }
            }
        }
    },
    beforeInsert: async function () {
        await util.checkAPIName(this.object_name, 'name', this.doc.name);

    },
    beforeUpdate: async function () {
        if (_.has(this.doc, 'name')) {
            await util.checkAPIName(this.object_name, 'name', this.doc.name, this.id);
        }
    }
}