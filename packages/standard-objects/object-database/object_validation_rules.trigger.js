const _ = require("underscore");
const util = require('../util');
const objectql = require("@steedos/objectql");
const core = require("@steedos/core");
const InternalData = require('../core/internalData');

module.exports = {
    afterFind: async function(){
        let filters = InternalData.parserFilters(this.query.filters)
        let validationRules = [];
        if(filters.object_name){
            validationRules = objectql.getObjectValidationRules(filters.object_name);
            delete filters.object_name;
        }else{
            validationRules = objectql.getAllObjectValidationRules();
        }

        validationRules = InternalData.filtSourceFile(validationRules, filters)

        let existNames = _.pluck(this.data.values, "name")
        let sourceNames = _.pluck(validationRules, "name")

        let differentNames = _.difference(sourceNames, existNames);
        validationRules = _.filter(validationRules, function(item){ 
            return _.contains(differentNames, item.name)
        })
        if(validationRules && validationRules.length>0){
            this.data.values = this.data.values.concat(validationRules)
        }
    },
    afterAggregate: async function(){
        let filters = InternalData.parserFilters(this.query.filters)
        let validationRules = [];
        if(filters.object_name){
            validationRules = objectql.getObjectValidationRules(filters.object_name);
            delete filters.object_name;
        }else{
            validationRules = objectql.getAllObjectValidationRules();
        }
        validationRules = InternalData.filtSourceFile(validationRules, filters)

        let existNames = _.pluck(this.data.values, "name")
        let sourceNames = _.pluck(validationRules, "name")

        let differentNames = _.difference(sourceNames, existNames);
        validationRules = _.filter(validationRules, function(item){ 
            return _.contains(differentNames, item.name)
        })
        if(validationRules && validationRules.length>0){
            this.data.values = this.data.values.concat(validationRules)
        }
    },
    afterCount: async function(){
        let filters = InternalData.parserFilters(this.query.filters)
        let validationRules = [];
        if(filters.object_name){
            validationRules = objectql.getObjectValidationRules(filters.object_name);
            delete filters.object_name;
        }else{
            validationRules = objectql.getAllObjectValidationRules();
        }
        
        validationRules = InternalData.filtSourceFile(validationRules, filters)

        let existNames = _.pluck(this.data.values, "name")
        let sourceNames = _.pluck(validationRules, "name")

        let differentNames = _.difference(sourceNames, existNames);
        validationRules = _.filter(validationRules, function(item){ 
            return _.contains(differentNames, item.name)
        })
        if(validationRules && validationRules.length>0){
            this.data.values = this.data.values + validationRules.length
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
        await util.checkAPIName(this.object_name, 'name', this.doc.name, undefined, [['is_system','!=', true]]);

    },
    beforeUpdate: async function () {
        if (_.has(this.doc, 'name')) {
            await util.checkAPIName(this.object_name, 'name', this.doc.name, this.id, [['is_system','!=', true]]);
        }
    }
}
