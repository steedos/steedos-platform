const _ = require('underscore');
const objectql = require("@steedos/objectql");
const clone = require("clone");

function getCategories(){
    let categories = []
    _.each(_.groupBy(objectql.getConfigs("flow"), function(f){ return f.category;}), function(v, k){
        if(!_.isEmpty(v)){
            categories.push(Object.assign({_id: k, name: v[0].category_name}))
        }
    })
    return clone(categories);
}

module.exports = {
    afterFind: async function(){
        if(this.spaceId === 'template'){
            this.data.values = this.data.values.concat(getCategories())
        }
    },
    afterAggregate: async function(){
        if(this.spaceId === 'template'){
            this.data.values = this.data.values.concat(getCategories())
        }
    }
}