/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-06-23 17:58:55
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-04-27 18:05:47
 * @Description: 
 */
const _ = require("underscore");
const objectql = require("@steedos/objectql");

module.exports = {
    afterFind: async function(){
        let spaceId = this.spaceId;
        let sourceData = objectql.getSourceRoles();
        this.data.values = this.data.values.concat(sourceData);
        this.data.values = objectql.getSteedosSchema().metadataDriver.find(this.data.values, this.query, spaceId);
    },
    afterCount: async function(){
        let spaceId = this.spaceId;
        this.data.values = this.data.values + objectql.getSteedosSchema().metadataDriver.count(objectql.getSourceRoles(), this.query, spaceId);
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