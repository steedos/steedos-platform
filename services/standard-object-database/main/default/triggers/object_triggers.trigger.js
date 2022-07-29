/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2021-06-03 15:11:52
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-07-29 11:31:59
 * @Description: 
 */
const InternalData = require('@steedos/standard-objects').internalData;

module.exports = {
    afterFind: async function(){
        let filters = InternalData.parserFilters(this.query.filters)
        if(filters.object){
            let triggers = await InternalData.getObjectTriggers(filters.object, this.userId);
            if(triggers){
                this.data.values = this.data.values.concat(triggers)
            }
        }
    },
    afterAggregate: async function(){
        let filters = InternalData.parserFilters(this.query.filters)
        if(filters.object){
            let triggers = await InternalData.getObjectTriggers(filters.object, this.userId);
            if(triggers){
                this.data.values = this.data.values.concat(triggers)
            }
        }
    },
    afterCount: async function(){
        let filters = InternalData.parserFilters(this.query.filters)
        if(filters.object){
            let triggers = await InternalData.getObjectTriggers(filters.object, this.userId);
            if(triggers){
                this.data.values = this.data.values + triggers.length
            }
        }
    },
    afterFindOne: async function(){
        if(_.isEmpty(this.data.values)){
            let id = this.id
            let objectName = id.substr(0, id.indexOf("."));
            if(objectName){
                let trigger = await InternalData.getObjectTrigger(objectName, this.userId, id);
                if(trigger){
                    this.data.values = trigger;
                }
            }
        }
    }
}