const _ = require("underscore");
const objectql = require("@steedos/objectql");
const InternalData = require('./core/internalData');

module.exports = {
    afterFind: async function(){
        let filters = InternalData.parserFilters(this.query.filters)
        let roles = [];
        if(filters.name){
            role = objectql.getSourceRole(filters.name);
            if(role){
                roles.push(role);
            }
        }else{
            roles = objectql.getSourceRoles();
        }

        roles = InternalData.filtSourceFile(roles, filters)

        let existNames = _.pluck(this.data.values, "name")
        let sourceNames = _.pluck(roles, "name")

        let differentNames = _.difference(sourceNames, existNames);
        roles = _.filter(roles, function(item){ 
            return _.contains(differentNames, item.name)
        })

        if(roles){
            this.data.values = this.data.values.concat(roles)
        }
    },
    afterAggregate: async function(){
        let filters = InternalData.parserFilters(this.query.filters)
        let roles = [];
        if(filters.name){
            role = objectql.getSourceRole(filters.name);
            if(role){
                roles.push(role);
            }
        }else{
            roles = objectql.getSourceRoles();
        }

        roles = InternalData.filtSourceFile(roles, filters)

        let existNames = _.pluck(this.data.values, "name")
        let sourceNames = _.pluck(roles, "name")

        let differentNames = _.difference(sourceNames, existNames);
        roles = _.filter(roles, function(item){ 
            return _.contains(differentNames, item.name)
        })

        if(roles){
            this.data.values = this.data.values.concat(roles)
        }
    },
    afterCount: async function(){
        let filters = InternalData.parserFilters(this.query.filters)
        let roles = [];
        if(filters.name){
            role = objectql.getSourceRole(filters.name);
            if(role){
                roles.push(role);
            }
        }else{
            roles = objectql.getSourceRoles();
        }

        roles = InternalData.filtSourceFile(roles, filters)

        let existNames = _.pluck(this.data.values, "name")
        let sourceNames = _.pluck(roles, "name")

        let differentNames = _.difference(sourceNames, existNames);
        roles = _.filter(roles, function(item){ 
            return _.contains(differentNames, item.name)
        })

        if(roles){
            this.data.values = this.data.values + roles.length
        }
    },
    afterFindOne: async function(){
        if(_.isEmpty(this.data.values)){
            let id = this.id
            if(id){
                let role = objectql.getSourceRole(id);
                if(role){
                    this.data.values = role;
                }
            }
        }
    }
}