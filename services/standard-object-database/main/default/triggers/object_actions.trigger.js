/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-05-28 11:07:57
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-10-31 17:36:24
 * @Description: 
 */
const InternalData = require('@steedos/standard-objects').internalData;
const objectql = require('@steedos/objectql');
const auth = require("@steedos/auth");
const clone = require('clone');
const sleep = async (ms) => new Promise(resolve => setTimeout(resolve, ms));
module.exports = {
    beforeInsert: async function(){
        const { doc } = this;
        delete doc.visible_type
        doc.visible;
    },
    beforeUpdate: async function(){
        const { doc, id } = this;
        if(doc.label){
            const dbRecord = await this.getObject('object_actions').findOne(id);

            const amis_schema = doc.amis_schema || dbRecord.amis_schema;
    
            if(dbRecord && dbRecord.label != doc.label && amis_schema && _.isString(amis_schema) ){
                try {
                    const json = JSON.parse(amis_schema);
                    json.body[0].label = doc.label
                    doc.amis_schema = JSON.stringify(json)
                } catch (error) {
                    console.log(error)
                }
            }
        }
        delete doc.visible_type
        doc.visible;
    },
    beforeFind: async function () {
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
                const cloneValues = clone(this.data.values, false);
                dataList.forEach((doc) => {
                    if (!_.find(this.data.values, (value) => {
                        return value.name === doc.name
                    })) {
                        cloneValues.push(Object.assign({_id: `${objectName}.${doc.name}`}, doc));
                    }
                })
                const records = objectql.getSteedosSchema().metadataDriver.find(cloneValues, this.query, spaceId);
                if (records.length > 0) {
                    this.data.values = records;
                } else {
                    this.data.values.length = 0;
                }
            }
        }

        // _.each(this.data.values, (item)=>{
        //     if(item.visibleOn){
        //         item.visible_type = "expression"
        //     }else if(item.visible === true){
        //         item.visible_type = "static"
        //     }
        // })

        _.each(this.data.values, (item)=>{
            if(item.visible != false){
                item.visible = true
            }
        })

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

        if(this.data.values){
            if(this.data.values.visibleOn){
                this.data.values.visible_type = "expression"
            }else if(this.data.values.visible === true){
                this.data.values.visible_type = "static"
            }
        }

    },
    afterDelete: async function(){
        await sleep(1000 * 2);
    }
}