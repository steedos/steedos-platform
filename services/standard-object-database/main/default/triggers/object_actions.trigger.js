/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-05-28 11:07:57
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-10-16 13:58:22
 * @Description: 
 */
const InternalData = require('@steedos/standard-objects').internalData;
const objectql = require('@steedos/objectql');
const auth = require("@steedos/auth");
const sleep = async (ms) => new Promise(resolve => setTimeout(resolve, ms));
module.exports = {
    beforeInsert: async function(){
        const { doc } = this;
        doc.visible;
    },
    beforeUpdate: async function(){
        const { doc } = this;
        doc.visible;
    },
    beforeFind: async function () {
        delete this.query.fields;
    },

    beforeAggregate: async function () {
        delete this.query.fields;
    },

    afterFind: async function(){
        let filters = InternalData.parserFilters(this.query.filters)
        const { spaceId } = this;

        let objectName = filters.object;
        if(!objectName && filters._id && filters._id.indexOf(".") > -1){
            objectName = filters._id.split('.')[0];
        }
        if(objectName){
            let dataList = await InternalData.getObjectActions(objectName, this.userId);
            if (!_.isEmpty(dataList)) {
                dataList.forEach((doc) => {
                    if (!_.find(this.data.values, (value) => {
                        return value.name === doc.name
                    })) {
                        this.data.values.push(Object.assign({_id: `${objectName}.${doc.name}`}, doc));
                    }
                })
                const records = objectql.getSteedosSchema().metadataDriver.find(this.data.values, this.query, spaceId);
                if (records.length > 0) {
                    this.data.values = records;
                } else {
                    this.data.values.length = 0;
                }
            }
        }
    },
    afterAggregate: async function(){
        let filters = InternalData.parserFilters(this.query.filters)
        const { spaceId } = this;

        let objectName = filters.object;
        if(!objectName && filters._id && filters._id.indexOf(".") > -1){
            objectName = filters._id.split('.')[0];
        }

        let dataList = await InternalData.getObjectActions(objectName, this.userId);
        if (!_.isEmpty(dataList)) {
            dataList.forEach((doc) => {
                if (!_.find(this.data.values, (value) => {
                    return value.name === doc.name
                })) {
                    this.data.values.push(Object.assign({_id: `${objectName}.${doc.name}`}, doc));
                }
            })
            const records = objectql.getSteedosSchema().metadataDriver.find(this.data.values, this.query, spaceId);
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
            let id = this.id
            let objectName = id.substr(0, id.indexOf("."));
            if(objectName){
                let action = await InternalData.getObjectAction(objectName, this.userId, id);
                if(action){
                    this.data.values = action;
                }
            }
        }
    },
    afterDelete: async function(){
        await sleep(1000 * 2);
    }
}