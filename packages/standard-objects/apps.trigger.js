const _ = require('underscore');
const clone = require("clone");
const objectql = require("@steedos/objectql");
const i18n = require("@steedos/i18n");
const auth = require("@steedos/auth");

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

const getLng = function(userId){
    return Steedos.locale(userId, true);
}

module.exports = {
    afterFind: async function () {
        if(_.isArray(this.data.values)){
            let lng = getLng(this.userId);
            let self = this;
            let allApps = clone(objectql.getAppConfigs());
            let apps = {}
            _.each(allApps, function(app){
                if(app.is_creator){
                    apps[app._id] = app
                }
            })
            i18n.translationApps(lng, apps)
            _.each(apps, function(app){
                app.name = app.label
                if(!_.find(self.data.values, function(item){return item.code === app._id})){
                    self.data.values.push(Object.assign({code: app._id}, clone(app), baseRecord));
                }
            })
        }
    },
    afterAggregate: async function () {
        if(_.isArray(this.data.values)){
            let lng = getLng(this.userId);
            let self = this;
            let allApps = clone(objectql.getAppConfigs());
            let apps = {}
            _.each(allApps, function(app){
                if(app.is_creator){
                    apps[app._id] = app
                }
            })
            i18n.translationApps(lng, apps)
            _.each(apps, function(app){
                app.name = app.label
                if(!_.find(self.data.values, function(item){return item.code === app._id})){
                    self.data.values.push(Object.assign({code: app._id}, clone(app), baseRecord));
                }
            })
        }
    },
    afterCount: async function () {
        let result = await objectql.getObject('apps').find(this.query, await auth.getSessionByUserId(this.userId, this.spaceId))
        this.data.values = result.length
    },
    afterFindOne: async function () {
        let id = this.id;
        if(id && _.isEmpty(this.data.values)){
            let lng = getLng(this.userId);
            let allApps = clone(objectql.getAppConfigs());
            let apps = {}
            _.each(allApps, function(app){
                if(app._id === id && app.is_creator){
                    apps[app._id] = app
                }
            })
            i18n.translationApps(lng, apps)
            let sefl = this;
            _.each(apps, function(app){
                app.name = app.label
                Object.assign(sefl.data.values, Object.assign({code: app._id}, clone(app), baseRecord))
            })
        }
    }
}