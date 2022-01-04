const InternalData = require('../core/internalData');
//由于新版lookup 组件限制。需编写trigger处理在只读页面不显示已选中项的问题
//由于lookup组件强依赖_id 字段，所以必须返回_id
module.exports = {
    afterFind: async function(){
        let filters = InternalData.parserFilters(this.query.filters)
        if(filters.name && filters.name === 'default'){
            try {
                let lng = Steedos.locale(this.userId, true)
                this.data.values = [{_id: 'default', name: 'default', label: TAPi18n.__(`objects_field_datasource_defaultValue`, {}, lng)}]
            } catch (error) {
                console.log(error)
            }
        }
    },
    afterAggregate: async function(){
        let filters = InternalData.parserFilters(this.query.filters)
        if(filters.name && filters.name === 'default'){
            try {
                let lng = Steedos.locale(this.userId, true)
                this.data.values = [{_id: 'default', name: 'default', label: TAPi18n.__(`objects_field_datasource_defaultValue`, {}, lng)}]
            } catch (error) {
                console.log(error)
            }
        }
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