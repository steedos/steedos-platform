const _ = require("underscore");
const objectql = require("@steedos/objectql");
const InternalData = require('./core/internalData');

const getInternalRoles = function(sourceRoles, filters){
    let dbRoles = Creator.getCollection("roles").find(filters, {fields:{_id:1, name:1}}).fetch();
    let roles = [];

    if(!filters.is_system){
        _.forEach(sourceRoles, function(doc){
            if(!_.find(dbRoles, function(p){
                return p.name === doc.name
            })){
                roles.push(doc);
            }
        })
    }
    return roles;
}

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

        roles = getInternalRoles(roles, filters);

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

        roles = getInternalRoles(roles, filters);

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

        roles = getInternalRoles(roles, filters);

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