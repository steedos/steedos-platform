/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-05-16 11:55:06
 * @Description: 
 */
const InternalData = require('@steedos/standard-objects').internalData;
const objectql = require('@steedos/objectql');
const auth = require('@steedos/auth');
const _ = require('underscore');
const clone = require('clone');
//由于新版lookup 组件限制。需编写trigger处理在只读页面不显示已选中项的问题
//由于lookup组件强依赖_id 字段，所以必须返回_id

const PERMISSIONS = {
    allowEdit: false,
    allowDelete: false,
    allowRead: true,
};

const BASERECORD = {
    is_system: true,
    record_permissions: PERMISSIONS
};

module.exports = {

    beforeFind: async function () {
        delete this.query.fields;
    },
    afterFind: async function(){
        const { spaceId } = this;
        let lng = Steedos.locale(this.userId, true);
        let dataList = [{_id: 'default', name: 'default', label: TAPi18n.__(`objects_field_datasource_defaultValue`, {}, lng), ...BASERECORD}];
        let filters = InternalData.parserFilters(this.query.filters)
        if(filters._id === 'meteor'){
            dataList.push({_id: 'meteor', name: 'meteor', label: TAPi18n.__(`objects_field_datasource_meteor`, {}, lng), ...BASERECORD})
        }
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
        if(this.id){
            if(this.id === 'default'){
                try {
                    let lng = Steedos.locale(this.userId, true)
                    this.data.values = {_id: 'default', name: 'default', label: TAPi18n.__(`objects_field_datasource_defaultValue`, {}, lng), ...BASERECORD};
                } catch (error) {
                    
                }
            }
            if(this.id === 'meteor'){
                try {
                    let lng = Steedos.locale(this.userId, true)
                    this.data.values = {_id: 'meteor', name: 'meteor', label: TAPi18n.__(`objects_field_datasource_meteor`, {}, lng), ...BASERECORD};
                } catch (error) {
                    
                }
            }
            
            if(_.isEmpty(this.data.values)){
                const records = await objectql.getObject('datasources').find({filters: ['name', '=', this.id]})
                this.data.values = records.length > 0 ? records[0]: null
            }
            
        }
    }
}