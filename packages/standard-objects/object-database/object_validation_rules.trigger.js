const _ = require("underscore");
const util = require('../util');
const objectql = require("@steedos/objectql");
const core = require("@steedos/core");
const InternalData = require('../core/internalData');

const getInternalValidationRules = function(sourceValidationRules, filters){
    let dbValidationRules = Creator.getCollection("object_validation_rules").find(filters, {fields:{_id:1, name:1}}).fetch();
    let validationRules = [];

    if(!filters.is_system){
        _.forEach(sourceValidationRules, function(doc){
            if(!_.find(dbValidationRules, function(p){
                return p.name === doc.name
            })){
                validationRules.push(doc);
            }
        })
    }
    return validationRules;
}

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

        validationRules = getInternalValidationRules(validationRules, filters);

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
        
        validationRules = getInternalValidationRules(validationRules, filters);

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
        
        validationRules = getInternalValidationRules(validationRules, filters);

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
