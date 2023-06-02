/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-06-23 17:58:55
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-05-16 15:08:20
 * @Description: 
 */
const _ = require("underscore");
const objectql = require("@steedos/objectql");

module.exports = {
    beforeFind: async function () {
        delete this.query.fields;
    },
    afterFind: async function(){
        let spaceId = this.spaceId;
        let sourceData = objectql.getSourceRoles();
        let _values = _.filter(sourceData, (item)=>{
            return !_.find(this.data.values, (value)=>{
                return value.api_name == item.api_name;
            });
        })
        let values = this.data.values.concat(_values);
        this.data.values = objectql.getSteedosSchema().metadataDriver.find(values, this.query, spaceId);
    },
    afterCount: async function(){
        let spaceId = this.spaceId;
        this.data.values = objectql.getObject('roles').find(this.query, spaceId).length;
    },
    afterFindOne: async function(){
        let spaceId = this.spaceId;
        if(_.isEmpty(this.data.values)){
            const records = objectql.getSteedosSchema().metadataDriver.find(objectql.getSourceRoles(), {filters: ['_id', '=', this.id]}, spaceId);
            if(records.length > 0){
                this.data.values = records[0]
            }
        }
    }
}