/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-05 14:17:44
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-10-09 15:46:06
 * @Description: 
 */
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
    
    beforeFind: async function () {
        delete this.query.fields;
    },

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
                if(app.is_creator || app.mobile){
                    apps[app._id] = app
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
            self.data.values = objectql.getSteedosSchema().metadataDriver.find(self.data.values, self.query, spaceId);
        }
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
            if(app){
                i18n.translationApp(lng, app._id, app)
                Object.assign(this.data.values, Object.assign({code: app._id}, clone(app), baseRecord))
            }
        }
    }
}