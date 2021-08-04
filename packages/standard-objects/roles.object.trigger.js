const _ = require("underscore");
const objectql = require("@steedos/objectql");
const InternalData = require('./core/internalData');
const util = require('./util');

const getInternalRoles = function(sourceRoles, filters){
    let dbRoles = Creator.getCollection("roles").find(filters, {fields:{_id:1, api_name:1}}).fetch();
    let roles = [];

    if(!filters.is_system){
        _.forEach(sourceRoles, function(doc){
            if(!_.find(dbRoles, function(p){
                return p.api_name === doc.api_name
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
        if(filters.api_name){
            role = objectql.getSourceRole(filters.api_name);
            if(role){
                roles.push(role);
            }
        }else if(filters._id){
            roles = Creator.getCollection("roles").find({api_name: filters._id}).fetch();
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
        if(filters.api_name){
            role = objectql.getSourceRole(filters.api_name);
            if(role){
                roles.push(role);
            }
        }else if(filters._id){
            roles = Creator.getCollection("roles").find({api_name: filters._id}).fetch();
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
        if(filters.api_name){
            role = objectql.getSourceRole(filters.api_name);
            if(role){
                roles.push(role);
            }
        }else if(filters._id){
            roles = Creator.getCollection("roles").find({api_name: filters._id}).fetch();
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

                let dbRole = Creator.getCollection("roles").find({api_name: id}).fetch();
                if(dbRole && dbRole.length > 0){
                    this.data.values = dbRole[0];
                    return;
                }

                let role = objectql.getSourceRole(id);
                if(role){
                    this.data.values = role;
                }
            }
        }
    }
}