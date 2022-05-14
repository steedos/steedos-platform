const objectql = require('@steedos/objectql');
const auth = require('@steedos/auth');
const _ = require('underscore');
//由于新版lookup 组件限制。需编写trigger处理在只读页面不显示已选中项的问题
//由于lookup组件强依赖_id 字段，所以必须返回_id
module.exports = {

    beforeFind: async function () {
        delete this.query.fields;
    },

    beforeAggregate: async function () {
        delete this.query.fields;
    },

    afterFind: async function(){
        const { spaceId } = this;
        let lng = Steedos.locale(this.userId, true)
        let dataList = [{_id: 'default', name: 'default', label: TAPi18n.__(`objects_field_datasource_defaultValue`, {}, lng)}];
        if (!_.isEmpty(dataList)) {
            dataList.forEach((doc) => {
                if (!_.find(this.data.values, (value) => {
                    return value.name === doc.name
                })) {
                    this.data.values.push(doc);
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
    afterAggregate: async function(){
        const { spaceId } = this;
        let lng = Steedos.locale(this.userId, true)
        let dataList = [{_id: 'default', name: 'default', label: TAPi18n.__(`objects_field_datasource_defaultValue`, {}, lng)}];
        if (!_.isEmpty(dataList)) {
            dataList.forEach((doc) => {
                if (!_.find(this.data.values, (value) => {
                    return value.name === doc.name
                })) {
                    this.data.values.push(doc);
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
        if(this.id && this.id === 'default'){
            try {
                let lng = Steedos.locale(this.userId, true)
                this.data.values = {_id: 'default', name: 'default', label: TAPi18n.__(`objects_field_datasource_defaultValue`, {}, lng)};
            } catch (error) {
                
            }
        }
    }
}