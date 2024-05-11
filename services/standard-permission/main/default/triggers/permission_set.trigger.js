/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-05 14:17:44
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2024-05-11 14:01:06
 * @Description: 
 */
const _ = require('underscore');
const objectql = require('@steedos/objectql');
const register = require('@steedos/metadata-registrar');
const auth = require("@steedos/auth");
const clone = require('clone');


const getSourcePermissionSets = async function(type){
    switch (type) {
        case 'permission_set':
            return await register.getSourcePermissionsets();
        case 'profile':
            return await register.getSourceProfiles();
        default:
            return (await register.getSourceProfiles()).concat((await register.getSourcePermissionsets()));
    }
    
}

module.exports = {
    beforeFind: async function () {
        delete this.query.fields;
    },

    afterFind: async function(){
        let { spaceId } = this;
        if(!spaceId){
            spaceId = process.env.STEEDOS_TENANT_ID;
        }
        if(!spaceId){
            const spaces = await objectql.getObject('spaces').find({});
            if(spaces.length > 0 ){
                spaceId = spaces[0]._id;
            }
        }
        let dataList = await getSourcePermissionSets();
        if (!_.isEmpty(dataList)) {
            const cloneValues = clone(this.data.values, false);
            dataList.forEach((doc) => {
                if (!_.find(this.data.values, (value) => {
                    return value.name === doc.name
                })) {
                    cloneValues.push(doc);
                }
            })
            const records = objectql.getSteedosSchema().metadataDriver.find(cloneValues, this.query, spaceId);
            if (records.length > 0) {
                this.data.values = records;
            } else {
                this.data.values.length = 0;
            }
        }

    },
    afterCount: async function(){
        delete this.query.fields;
        let result = await objectql.getObject(this.object_name).find(this.query, await auth.getSessionByUserId(this.userId, this.spaceId))
        this.data.values = result.length;
    },
    afterFindOne: async function(){
        if(_.isEmpty(this.data.values)){
            const all = await getSourcePermissionSets();
            const id = this.id;
            this.data.values = _.find(all, function(item){
                return item._id === id
            });
        }
    }
}