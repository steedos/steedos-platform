const _ = require('underscore');
const clone = require("clone");
const objectql = require("@steedos/objectql");
const i18n = require("@steedos/i18n");
const auth = require("@steedos/auth");
const InternalData = require('@steedos/standard-objects').internalData;
const SERVICE_NAME = `~database-apps`;
const permissions = {
    allowEdit: false,
    allowDelete: false,
    allowRead: true,
}

const baseRecord = {
    is_system:true,
    visible: true,
    record_permissions:permissions
}

const getLng = async function(userId){
    const userSession = await auth.getSessionByUserId(userId);
    return userSession ? userSession.language : null;
}

module.exports = {
    afterFind: async function () {
        const { spaceId } = this;
        let query = InternalData.parserFilters(this.query.filters);
        let isSystem = query.is_system;
        if(!_.isEmpty(isSystem) || _.isBoolean(isSystem)){
            if(_.isObject(isSystem) && isSystem["$ne"]){
                return;
            }
        }
        if(_.isArray(this.data.values)){
            let lng = await getLng(this.userId);
            let self = this;
            let allApps = clone(await objectql.getAppConfigs(this.spaceId));
            let apps = {}
            _.each(allApps, function(app){
                if(app.is_creator){
                    apps[app._id] = app
                }
            })
            i18n.translationApps(lng, apps)
            _.each(apps, function(app){
                app.name = app.label
                if(!_.find(self.data.values, function(item){return item.code === app._id || item._id === app._id})){
                    self.data.values.push(Object.assign({code: app._id}, clone(app), baseRecord));
                }
            })
            // console.log(`find this.query`, self.query, objectql.getSteedosSchema().metadataDriver.find(self.data.values, this.query, spaceId))
            self.data.values = objectql.getSteedosSchema().metadataDriver.find(self.data.values, self.query, spaceId);
        }
    },
    afterAggregate: async function () {
        const { spaceId } = this;
        let query = InternalData.parserFilters(this.query.filters);
        let isSystem = query.is_system;
        if(!_.isEmpty(isSystem) || _.isBoolean(isSystem)){
            if(_.isObject(isSystem) && isSystem["$ne"]){
                return;
            }
        }
        if(_.isArray(this.data.values)){
            let lng = await getLng(this.userId);
            let self = this;
            let allApps = clone(await objectql.getAppConfigs(this.spaceId));
            let apps = {}
            _.each(allApps, function(app){
                if(app.is_creator){
                    apps[app._id] = app
                }
            })
            i18n.translationApps(lng, apps)
            _.each(apps, function(app){
                app.name = app.label
                if(!_.find(self.data.values, function(item){return item.code === app._id || item._id === app._id})){
                    self.data.values.push(Object.assign({code: app._id}, clone(app), baseRecord));
                }
            })
        }
        // 获取的apps根据保存的值进行过滤
        // const allData = this.data.values;
        // const firstFilterKey = _.keys(query)[0];
        // this.data.values = _.filter(allData, (item)=>{
        //     return item[firstFilterKey] === query[firstFilterKey];
        // })
        // console.log(`afterAggregate this.query`, this.query, objectql.getSteedosSchema().metadataDriver.find(this.data.values, this.query, spaceId))
        this.data.values = objectql.getSteedosSchema().metadataDriver.find(this.data.values, this.query, spaceId);
    },
    afterCount: async function () {
        try {
            this.query.fields.push('name');
            this.query.fields.push('code');
        } catch (error) {

        }
        let result = await objectql.getObject('apps').find(this.query, await auth.getSessionByUserId(this.userId, this.spaceId))
        this.data.values = result.length
    },
    afterFindOne: async function () {
        let id = this.id;
        if(id && _.isEmpty(this.data.values)){
            let lng = await getLng(this.userId);
            let app = await objectql.getAppConfig(id);
            // let allApps = clone(await objectql.getAppConfigs(this.spaceId));
            // let apps = {}
            // _.each(allApps, function(app){
            //     if(app._id === id && app.is_creator){
            //         apps[app._id] = app
            //     }
            // })
            i18n.translationApp(lng, app._id, app)
            Object.assign(this.data.values, Object.assign({code: app._id}, clone(app), baseRecord))
            // let sefl = this;
            // _.each(apps, function(app){
            //     app.name = app.label
            //     Object.assign(sefl.data.values, Object.assign({code: app._id}, clone(app), baseRecord))
            // })
        }
    },
    // afterInsert: async function () {
    //     const record = await this.getObject('apps').findOne(this.doc._id);
    //     await objectql.addAppConfig(record, SERVICE_NAME)
    // },
    // afterUpdate: async function () {
    //     const record = await this.getObject('apps').findOne(this.id);
    //     await objectql.addAppConfig(record, SERVICE_NAME)
    // },
    // afterDelete: async function(){
    //     let id = this.id;
    //     objectql.removeApp(id)
    // }
}